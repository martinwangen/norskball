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
    [GraphQLDescription("Represents the available MatchPlayer queries.")]
    [ExtendObjectType(typeof(Query))]
    public class MatchPlayerQuery
    {
        [UsePaging(MaxPageSize = 50, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
        
        public IQueryable<MatchPlayer>? MatchPlayers(NorskballDbContext db) => 
            db.MatchPlayers.AsNoTracking()
                .Include(mp => mp.Player)
                .Include(mp => mp.Team)
                .Include(mp => mp.Ratings);
    }
} 