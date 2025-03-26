using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.Models;
using Serilog;

namespace Norskball.GraphQL.Mutations;

[GraphQLDescription("Represents the available Rating mutations.")]
[ExtendObjectType(typeof(Mutation))]
public class RatingMutations
{
    [Authorize(Roles = new[] {"Rater", "Admin"})]
    public async Task<Rating> AddRatingAsync(NorskballDbContext dbContext, Rating rating)
    {
        // Validate rating score is between 1 and 10
        if (rating.Score < 1 || rating.Score > 10)
            throw new Exception("Rating score must be between 1 and 10");

        dbContext.Ratings.Add(rating);
        await dbContext.SaveChangesAsync();
        return rating;
    }

    [Authorize(Roles = new[] {"Rater", "Admin"})]
    public async Task<Rating> UpdateRatingAsync(NorskballDbContext dbContext, Rating rating)
    {
        // Validate rating score is between 1 and 10
        if (rating.Score < 1 || rating.Score > 10)
            throw new Exception("Rating score must be between 1 and 10");

        dbContext.Ratings.Update(rating);
        await dbContext.SaveChangesAsync();
        return rating;
    }

    [Authorize(Roles = new[] {"admin"})]
    public async Task<Rating> DeleteRatingAsync(NorskballDbContext dbContext, string id)
    {
        var rating = await dbContext.Ratings.FindAsync(id);

        if (rating == null)
            throw new Exception($"Could not find the specified {nameof(rating)} with ID {id} to delete; was it already deleted?");

        dbContext.Ratings.Remove(rating);
        await dbContext.SaveChangesAsync();
        return rating;
    }
    
    public async Task<Rating> AddSimpleRatingAsync(NorskballDbContext dbContext, string matchPlayerId, int score)
    {
        // Validate rating score is between 1 and 10
        if (score < 1 || score > 10)
            throw new Exception("Rating score must be between 1 and 10");

        // Find the match player for this player
        var matchPlayer = await dbContext.MatchPlayers
            .FirstOrDefaultAsync(mp => mp.Id == matchPlayerId);

        if (matchPlayer == null)
            throw new Exception($"Could not find match player for player {matchPlayerId}");

        // Create new rating
        var rating = new Rating
        {
            Id = Guid.NewGuid().ToString(),
            MatchPlayerId = matchPlayer.Id,
            UserId = "system", // This will be replaced with actual user ID from auth context
            Score = score,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Ratings.Add(rating);
        await dbContext.SaveChangesAsync();
        return rating;
    }
} 