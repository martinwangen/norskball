using HotChocolate.Authorization;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.Models;
using Serilog;

namespace Norskball.GraphQL.Mutations;

[GraphQLDescription("Represents the available MatchPlayer mutations.")]
[ExtendObjectType(typeof(Mutation))]
public class MatchPlayerMutations
{
    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchPlayer> AddMatchPlayerAsync(NorskballDbContext dbContext, MatchPlayer matchPlayer)
    {
        dbContext.MatchPlayers.Add(matchPlayer);
        await dbContext.SaveChangesAsync();
        return matchPlayer;
    }

    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchPlayer> UpdateMatchPlayerAsync(NorskballDbContext dbContext, MatchPlayer matchPlayer)
    {
        dbContext.MatchPlayers.Update(matchPlayer);
        await dbContext.SaveChangesAsync();
        return matchPlayer;
    }

    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchPlayer> DeleteMatchPlayerAsync(NorskballDbContext dbContext, string id)
    {
        var matchPlayer = await dbContext.MatchPlayers.FindAsync(id);

        if (matchPlayer == null)
            throw new Exception($"Could not find the specified {nameof(matchPlayer)} with ID {id} to delete; was it already deleted?");

        dbContext.MatchPlayers.Remove(matchPlayer);
        await dbContext.SaveChangesAsync();
        return matchPlayer;
    }

    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchPlayer> SubstitutePlayerAsync(NorskballDbContext dbContext, string matchPlayerId, DateTime substitutionTime)
    {
        var matchPlayer = await dbContext.MatchPlayers.FindAsync(matchPlayerId);

        if (matchPlayer == null)
            throw new Exception($"Could not find the specified {nameof(matchPlayer)} with ID {matchPlayerId}");

        matchPlayer.SubstitutedOutAt = substitutionTime;
        await dbContext.SaveChangesAsync();
        return matchPlayer;
    }
} 