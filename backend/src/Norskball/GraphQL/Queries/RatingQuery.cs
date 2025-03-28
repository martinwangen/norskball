using System.Collections.Generic;
using Norskball.Models;
using Norskball.Data;
using Norskball.GraphQL.Base;
using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;

namespace Norskball.GraphQL.Queries
{
    [GraphQLDescription("Represents the available Rating queries.")]
    [ExtendObjectType(typeof(Query))]
    public class RatingQuery
    {
        
        [UseProjection]
        public IQueryable<Match> GetMatchRatingsOnlyRatedPlayers(NorskballDbContext db, string matchId)
        {
            var match = db.Matches
                .AsNoTracking()
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Events)
                .Include(m => m.HomeTeamLineup)
                    .ThenInclude(l => l.Players)
                    .ThenInclude(p => p.Ratings)
                .Include(m => m.AwayTeamLineup)
                    .ThenInclude(l => l.Players)
                    .ThenInclude(p => p.Ratings)
                .Where(m => m.Id == matchId);

            return match;
        }
        
        [UsePaging(MaxPageSize = 100, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
        public IQueryable<Match> GetAllMatchRatingsOnlyRatedPlayers(NorskballDbContext db, DateTime? beforeDate = null)
        {
            var matches = db.Matches.AsNoTracking();

            if (beforeDate.HasValue)
            {
                matches = matches.Where(m => m.ScheduledDate < beforeDate.Value);
            }

            matches = matches
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
                );

            return matches;
        }
        
        
        
        
        
        [UsePaging(MaxPageSize = 100, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
        public IQueryable<Rating>? Ratings(NorskballDbContext db) => 
            db.Ratings.AsNoTracking()
                .Include(r => r.MatchPlayer)
                    .ThenInclude(mp => mp.Player);
    }
} 