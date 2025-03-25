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
    [GraphQLDescription("Represents the available Match queries.")]
    [ExtendObjectType(typeof(Query))]
    public class MatchQuery
    {
        [UsePaging(MaxPageSize = 50, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
        public IQueryable<Match> Matches(NorskballDbContext db)
        {
            var query = db.Matches.AsNoTracking()
                .Include(m => m.HomeTeam).ThenInclude(t => t.Players)
                .Include(m => m.AwayTeam).ThenInclude(t=>t.Players)
                .Include(m => m.Events)
                .Include(m => m.HomeTeamLineup).ThenInclude(l => l.Players)
                .Include(m => m.AwayTeamLineup).ThenInclude(l => l.Players);

            // Materialize the query
            return query;
        }
    }
} 