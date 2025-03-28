using Microsoft.EntityFrameworkCore;
using Norskball.Data;
using Norskball.Models;
using System.Text.Json.Serialization;

namespace Norskball.Services;

public class StatisticsService : IStatisticsService
{
    private readonly NorskballDbContext _db;

    public StatisticsService(NorskballDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<TeamPlayerStats>> GetTeamRatingsAsync(string teamId)
    {
        return await _db.Ratings
            .Where(r => r.MatchPlayer.TeamId == teamId)
            .GroupBy(r => r.MatchPlayer.Player)
            .Select(g => new TeamPlayerStats
            {
                PlayerId = g.Key.Id,
                PlayerName = $"{g.Key.FirstName} {g.Key.LastName}",
                AverageRating = g.Average(r => r.Score),
                RatingCount = g.Count(),
                MatchesPlayed = g.Select(r => r.MatchPlayer.Lineup.MatchId).Distinct().Count()
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<PlayerStats>> GetTopPlayersAsync(int? limit = 10)
    {
        var query = _db.Ratings
            .GroupBy(r => r.MatchPlayer.Player)
            .Select(g => new PlayerStats
            {
                PlayerId = g.Key.Id,
                PlayerName = $"{g.Key.FirstName} {g.Key.LastName}",
                AverageRating = g.Average(r => r.Score),
                RatingCount = g.Count(),
                MatchesPlayed = g.Select(r => r.MatchPlayer.Lineup.MatchId).Distinct().Count()
            })
            .OrderByDescending(p => p.AverageRating)
            .ThenByDescending(p => p.RatingCount);

        if (limit.HasValue)
        {
            return await query.Take(limit.Value).ToListAsync();
        }

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<DetailedPlayerStats>> GetDetailedPlayerStatsAsync(
        string? sortBy = "averageRating",
        string? sortOrder = "desc",
        DateTime? startDate = null,
        DateTime? endDate = null,
        int? limit = 10)
    {
        var query = _db.MatchEvents
            .Where(e => startDate == null || e.Match.ScheduledDate >= startDate)
            .Where(e => endDate == null || e.Match.ScheduledDate <= endDate)
            .GroupBy(e => e.PlayerId)
            .Select(g => new DetailedPlayerStats
            {
                PlayerId = g.Key,
                PlayerName = g.First().Player.FirstName + " " + g.First().Player.LastName,
                Goals = g.Count(e => e.Type == EventType.Goal),
                Assists = g.Count(e => e.Type == EventType.Goal && e.SecondaryPlayerId == g.Key),
                Points = g.Count(e => e.Type == EventType.Goal) + g.Count(e => e.Type == EventType.Goal && e.SecondaryPlayerId == g.Key),
                YellowCards = g.Count(e => e.Type == EventType.YellowCard),
                RedCards = g.Count(e => e.Type == EventType.RedCard),
                MatchesPlayed = g.Select(e => e.MatchId).Distinct().Count(),
                AverageRating = _db.Ratings
                    .Where(r => r.MatchPlayer.PlayerId == g.Key)
                    .Where(r => startDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate >= startDate)
                    .Where(r => endDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate <= endDate)
                    .Average(r => r.Score),
                HighestRating = _db.Ratings
                    .Where(r => r.MatchPlayer.PlayerId == g.Key)
                    .Where(r => startDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate >= startDate)
                    .Where(r => endDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate <= endDate)
                    .Max(r => r.Score),
                RatingCount = _db.Ratings
                    .Where(r => r.MatchPlayer.PlayerId == g.Key)
                    .Where(r => startDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate >= startDate)
                    .Where(r => endDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate <= endDate)
                    .Count()
            });

        // Apply sorting
        query = sortOrder?.ToLower() == "desc" 
            ? sortBy?.ToLower() switch
            {
                "goals" => query.OrderByDescending(p => p.Goals),
                "assists" => query.OrderByDescending(p => p.Assists),
                "goalsAndAssists" => query.OrderByDescending(p => p.Points),
                "yellowCards" => query.OrderByDescending(p => p.YellowCards),
                "redCards" => query.OrderByDescending(p => p.RedCards),
                "averageRating" => query.OrderByDescending(p => p.AverageRating),
                "highestRating" => query.OrderByDescending(p => p.HighestRating),
                _ => query.OrderByDescending(p => p.AverageRating)
            }
            : sortBy?.ToLower() switch
            {
                "goals" => query.OrderBy(p => p.Goals),
                "assists" => query.OrderBy(p => p.Assists),
                "goalsAndAssists" => query.OrderBy(p => p.Points),
                "yellowCards" => query.OrderBy(p => p.YellowCards),
                "redCards" => query.OrderBy(p => p.RedCards),
                "averageRating" => query.OrderBy(p => p.AverageRating),
                "highestRating" => query.OrderBy(p => p.HighestRating),
                _ => query.OrderBy(p => p.AverageRating)
            };

        if (limit.HasValue)
        {
            return await query.Take(limit.Value).ToListAsync();
        }

        return await query.ToListAsync();
    }

    public async Task<PaginatedResponse<Match>> GetAllMatchRatingsOnlyRatedPlayersAsync(
        DateTime? beforeDate = null,
        int? page = 1,
        int? pageSize = 10)
    {
        var query = _db.Matches.AsNoTracking();

        if (beforeDate.HasValue)
        {
            query = query.Where(m => m.ScheduledDate < beforeDate.Value);
        }

        query = query
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.Events)
            .Include(m => m.HomeTeamLineup)
                .ThenInclude(l => l.Players)
                .ThenInclude(p => p.Ratings)
            .Include(m => m.AwayTeamLineup)
                .ThenInclude(l => l.Players)
                .ThenInclude(p => p.Ratings)
            .Where(m => 
                (m.HomeTeamLineup != null) ||
                (m.AwayTeamLineup != null)
            )
            .OrderByDescending(m => m.ScheduledDate);

        // Apply pagination
        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        var currentPage = page ?? 1;
        currentPage = Math.Max(1, Math.Min(currentPage, totalPages));

        var matches = await query
            .Skip((currentPage - 1) * pageSize.Value)
            .Take(pageSize.Value)
            .ToListAsync();

        return new PaginatedResponse<Match>
        {
            TotalCount = totalCount,
            TotalPages = totalPages,
            CurrentPage = currentPage,
            PageSize = pageSize.Value,
            Items = matches
        };
    }
} 