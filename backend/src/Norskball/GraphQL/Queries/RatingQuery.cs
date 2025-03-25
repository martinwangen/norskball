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
        [UsePaging(MaxPageSize = 100, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
        public IQueryable<Rating>? Ratings(NorskballDbContext db) => 
            db.Ratings.AsNoTracking()
                .Include(r => r.MatchPlayer)
                    .ThenInclude(mp => mp.Player);
    }
} 