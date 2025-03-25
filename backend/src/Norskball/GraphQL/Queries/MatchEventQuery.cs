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
    [GraphQLDescription("Represents the available MatchEvent queries.")]
    [ExtendObjectType(typeof(Query))]
    public class MatchEventQuery
    {
        [UsePaging(MaxPageSize = 100, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
        
        public IQueryable<MatchEvent>? MatchEvents(NorskballDbContext db) => 
            db.MatchEvents.AsNoTracking()
                .Include(e => e.Match)
                .Include(e => e.Player)
                .Include(e => e.SecondaryPlayer)
                .Include(e => e.Team);
    }
} 