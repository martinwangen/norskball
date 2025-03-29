using System.Collections.Generic;
using System.Security.Claims;
using Norskball.Models;
using Norskball.Data;
using Norskball.GraphQL.Base;
using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;

namespace Norskball.GraphQL.Queries
{
    [GraphQLDescription("Represents the available Match queries.")]
    [ExtendObjectType(typeof(Query))]
    public class MatchQuery
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MatchQuery(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
    
        [UsePaging(MaxPageSize = 50, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
        public IQueryable<Match> GetMatches(NorskballDbContext db)
        {
            var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;

            // Use AsSplitQuery to split the complex query into multiple simpler queries
            var query = db.Matches
                .AsNoTracking()
                .AsSplitQuery()
                .Include(m => m.HomeTeam)
                    .ThenInclude(t => t.Players)
                .Include(m => m.AwayTeam)
                    .ThenInclude(t => t.Players)
                .Include(m => m.Events)
                .Include(m => m.HomeTeamLineup)
                    .ThenInclude(l => l.Players)
                        .ThenInclude(p => p.Ratings)
                .Include(m => m.AwayTeamLineup)
                    .ThenInclude(l => l.Players)
                        .ThenInclude(p => p.Ratings)
                .Include(m => m.Referee);

            return query;
        }
    }
} 