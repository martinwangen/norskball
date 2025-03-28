using System.Collections.Generic;
using System.Linq;
using Norskball.Models;
using Norskball.Data;
using Norskball.GraphQL.Base;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;

namespace Norskball.GraphQL.Queries
{
    [GraphQLDescription("Represents the available Statistics queries.")]
    [ExtendObjectType(typeof(Query))]
    public class StatisticsQuery
    {
        [GraphQLDescription("Get average ratings for a team across all matches")]
        public async Task<IEnumerable<TeamPlayerStats>> GetTeamRatings(
            string teamId,
            NorskballDbContext db)
        {
            return await db.Ratings
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

        [GraphQLDescription("Get top rated players across all matches")]
        public async Task<IEnumerable<PlayerStats>> GetTopPlayers(
            NorskballDbContext db,
            int? limit = 10)
        {
            var query = db.Ratings
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

        [GraphQLDescription("Get detailed player statistics with flexible sorting and time period filtering")]
        public async Task<IEnumerable<DetailedPlayerStats>> DetailedPlayerStats(
            NorskballDbContext db,
            string? sortBy = "averageRating",
            string? sortOrder = "desc",
            DateTime? startDate = null,
            DateTime? endDate = null,
            int? limit = 10)
        {
            var query = db.MatchEvents
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
                    AverageRating = db.Ratings
                        .Where(r => r.MatchPlayer.PlayerId == g.Key)
                        .Where(r => startDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate >= startDate)
                        .Where(r => endDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate <= endDate)
                        .Average(r => r.Score),
                    HighestRating = db.Ratings
                        .Where(r => r.MatchPlayer.PlayerId == g.Key)
                        .Where(r => startDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate >= startDate)
                        .Where(r => endDate == null || r.MatchPlayer.Lineup.Match.ScheduledDate <= endDate)
                        .Max(r => r.Score),
                    RatingCount = db.Ratings
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
    }

    public class MatchPlayerStats
    {
        public string MatchPlayerId { get; set; } = default!;
        public string PlayerName { get; set; } = default!;
        public double AverageRating { get; set; }
        public int RatingCount { get; set; }
    }

    public class TeamPlayerStats
    {
        public string PlayerId { get; set; } = default!;
        public string PlayerName { get; set; } = default!;
        public double AverageRating { get; set; }
        public int RatingCount { get; set; }
        public int MatchesPlayed { get; set; }
    }

    public class PlayerStats
    {
        public string PlayerId { get; set; } = default!;
        public string PlayerName { get; set; } = default!;
        public double AverageRating { get; set; }
        public int RatingCount { get; set; }
        public int MatchesPlayed { get; set; }
    }

    public class DetailedPlayerStats
    {
        public string PlayerId { get; set; } = default!;
        public string PlayerName { get; set; } = default!;
        public int Goals { get; set; }
        public int Assists { get; set; }
        public int Points { get; set; } // Goals + Assists
        public int YellowCards { get; set; }
        public int RedCards { get; set; }
        public int MatchesPlayed { get; set; }
        public double AverageRating { get; set; }
        public double HighestRating { get; set; }
        public int RatingCount { get; set; }
    }
} 