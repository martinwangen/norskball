using HotChocolate.Authorization;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.Models;
using Serilog;

namespace Norskball.GraphQL.Mutations;

[GraphQLDescription("Represents the available Player mutations.")]
[ExtendObjectType(typeof(Mutation))]
public class PlayerMutations
{
    
    public async Task<Player> AddPlayerAsync(NorskballDbContext dbContext, Player player)
    {
        dbContext.Players.Add(player);
        await dbContext.SaveChangesAsync();
        return player;
    }

    
    public async Task<Player> UpdatePlayerAsync(NorskballDbContext dbContext, Player player)
    {
        dbContext.Players.Update(player);
        await dbContext.SaveChangesAsync();
        return player;
    }

    
    public async Task<Player> DeletePlayerAsync(NorskballDbContext dbContext, string id)
    {
        var player = await dbContext.Players.FindAsync(id);

        if (player == null)
            throw new Exception($"Could not find the specified {nameof(player)} with ID {id} to delete; was it already deleted?");

        dbContext.Players.Remove(player);
        await dbContext.SaveChangesAsync();
        return player;
    }
}