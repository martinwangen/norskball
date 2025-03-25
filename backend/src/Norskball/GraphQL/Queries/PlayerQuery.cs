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
    [GraphQLDescription("Represents the available Player queries.")]
    [ExtendObjectType(typeof(Query))]
    public class PlayerQuery
    {
        
        //No need for filtering as there are only a few players (35) and they are not expected to change often.
        [UsePaging(MaxPageSize = 35, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
        public IQueryable<Player>? Players(NorskballDbContext db) => db.Players.AsNoTracking().Include(p=>p.Team);

    }
}
