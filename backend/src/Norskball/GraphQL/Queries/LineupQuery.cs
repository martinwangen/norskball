using Norskball.Models;
using Norskball.Data;
using Norskball.GraphQL.Base;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;

namespace Norskball.GraphQL.Queries;

[GraphQLDescription("Represents the available Lineup queries.")]
[ExtendObjectType(typeof(Query))]
public class LineupQuery
{
    public async Task<Lineup?> Lineup(NorskballDbContext db, string id)
    {
        return await db.Lineups.AsNoTracking()
            .Include(l => l.Players)
            .Include(l => l.Team)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    [UsePaging(MaxPageSize = 50, IncludeTotalCount = true), UseProjection, UseFiltering, UseSorting]
    public async Task<IEnumerable<Lineup>> TeamLineups(
        NorskballDbContext db, 
        string teamId, 
        string? matchId = null)
    {
        var query = db.Lineups.AsNoTracking()
            .Include(l => l.Players)
            .Include(l => l.Team)
            .Where(l => l.TeamId == teamId);

        return await query.ToListAsync();
    }
} 