using HotChocolate.Authorization;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.Models;
using Serilog;

namespace Norskball.GraphQL.Mutations;

[GraphQLDescription("Represents the available Match mutations.")]
[ExtendObjectType(typeof(Mutation))]
public class MatchMutations
{
    
    public async Task<Match> AddMatchAsync(NorskballDbContext dbContext, Match match)
    {
        dbContext.Matches.Add(match);
        await dbContext.SaveChangesAsync();
        return match;
    }

    
    public async Task<Match> UpdateMatchAsync(NorskballDbContext dbContext, Match match)
    {
        dbContext.Matches.Update(match);
        await dbContext.SaveChangesAsync();
        return match;
    }

    
    public async Task<Match> DeleteMatchAsync(NorskballDbContext dbContext, string id)
    {
        var match = await dbContext.Matches.FindAsync(id);

        if (match == null)
            throw new Exception($"Could not find the specified {nameof(match)} with ID {id} to delete; was it already deleted?");

        dbContext.Matches.Remove(match);
        await dbContext.SaveChangesAsync();
        return match;
    }

    
    public async Task<Match> UpdateMatchStatusAsync(NorskballDbContext dbContext, string id, Status status)
    {
        var match = await dbContext.Matches.FindAsync(id);

        if (match == null)
            throw new Exception($"Could not find the specified {nameof(match)} with ID {id}");

        match.Status = status;
        await dbContext.SaveChangesAsync();
        return match;
    }

    
    public async Task<Match> UpdateMatchScoreAsync(NorskballDbContext dbContext, string id, Score score)
    {
        var match = await dbContext.Matches.FindAsync(id);

        if (match == null)
            throw new Exception($"Could not find the specified {nameof(match)} with ID {id}");

        match.Score = score;
        await dbContext.SaveChangesAsync();
        return match;
    }
} 