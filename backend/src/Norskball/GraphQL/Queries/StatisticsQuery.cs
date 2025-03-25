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
} 