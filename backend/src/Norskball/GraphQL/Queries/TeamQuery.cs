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
    [GraphQLDescription("Represents the available Team queries.")]
    [ExtendObjectType(typeof(Query))]
    public class TeamQuery
    {
        [UsePaging(MaxPageSize = 20, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
        public IQueryable<Team>? Teams(NorskballDbContext db) => db.Teams.AsNoTracking().Include(t => t.Stadium);
    }
} 