using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.Models;
using Serilog;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Norskball.GraphQL.Mutations;

[GraphQLDescription("Represents the available Rating mutations.")]
[ExtendObjectType(typeof(Mutation))]
public class RatingMutations
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RatingMutations(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    
    public async Task<Rating> AddRatingAsync(NorskballDbContext dbContext, Rating rating)
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Validate rating score is between 1 and 10
        if (rating.Score < 1 || rating.Score > 10)
            throw new Exception("Rating score must be between 1 and 10");

        // Check for existing rating by the same user for this match player
        var existingRating = await dbContext.Ratings
            .FirstOrDefaultAsync(r => r.MatchPlayerId == rating.MatchPlayerId && r.UserId == userId);

        if (existingRating != null)
        {
            // Update existing rating
            existingRating.Score = rating.Score;
            dbContext.Ratings.Update(existingRating);
        }
        else
        {
            // Add new rating
            rating.CreatedAt = DateTime.UtcNow;
            dbContext.Ratings.Add(rating);
        }

        await dbContext.SaveChangesAsync();
        return existingRating ?? rating;
    }

    
    public async Task<Rating> UpdateRatingAsync(NorskballDbContext dbContext, Rating rating)
    {
        // Validate rating score is between 1 and 10
        if (rating.Score < 1 || rating.Score > 10)
            throw new Exception("Rating score must be between 1 and 10");

        // Find existing rating
        var existingRating = await dbContext.Ratings.FindAsync(rating.Id);
        if (existingRating == null)
            throw new Exception($"Could not find rating with ID {rating.Id}");

        // Update rating
        existingRating.Score = rating.Score;
        dbContext.Ratings.Update(existingRating);
        await dbContext.SaveChangesAsync();
        return existingRating;
    }

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
        if (string.IsNullOrEmpty(matchPlayerId))
            throw new Exception("Match player ID cannot be empty");

        var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userId))
            throw new Exception("User must be authenticated to add ratings");
        
        // Validate rating score is between 1 and 10
        if (score < 1 || score > 10)
            throw new Exception("Rating score must be between 1 and 10");

        // Find the match player for this player
        var matchPlayer = await dbContext.MatchPlayers
            .FirstOrDefaultAsync(mp => mp.Id == matchPlayerId);

        if (matchPlayer == null)
            throw new Exception($"Could not find match player for player {matchPlayerId}");

      
        // Check for existing rating by the same user for this match player
        var existingRating = await dbContext.Ratings
            .FirstOrDefaultAsync(r => r.MatchPlayerId == matchPlayerId && r.UserId == userId);

        if (existingRating != null)
        {
            // Update existing rating
            existingRating.Score = score;
            dbContext.Ratings.Update(existingRating);
            await dbContext.SaveChangesAsync();
            return existingRating;
        }

        // Create new rating
        var rating = new Rating
        {
            Id = Guid.NewGuid().ToString(),
            MatchPlayerId = matchPlayer.Id,
            UserId = userId,
            Score = score,
            CreatedAt = DateTime.UtcNow,
        };

        dbContext.Ratings.Add(rating);
        await dbContext.SaveChangesAsync();
        return rating;
    }
} 