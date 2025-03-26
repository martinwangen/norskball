using HotChocolate.Authorization;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.Models;
using Serilog;

namespace Norskball.GraphQL.Mutations;

[GraphQLDescription("Represents the available MatchEvent mutations.")]
[ExtendObjectType(typeof(Mutation))]
public class MatchEventMutations
{
    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchEvent> AddMatchEventAsync(NorskballDbContext dbContext, MatchEvent matchEvent)
    {
        dbContext.MatchEvents.Add(matchEvent);
        await dbContext.SaveChangesAsync();
        return matchEvent;
    }

    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchEvent> UpdateMatchEventAsync(NorskballDbContext dbContext, MatchEvent matchEvent)
    {
        dbContext.MatchEvents.Update(matchEvent);
        await dbContext.SaveChangesAsync();
        return matchEvent;
    }

    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchEvent> DeleteMatchEventAsync(NorskballDbContext dbContext, string id)
    {
        var matchEvent = await dbContext.MatchEvents.FindAsync(id);

        if (matchEvent == null)
            throw new Exception($"Could not find the specified {nameof(matchEvent)} with ID {id} to delete; was it already deleted?");

        dbContext.MatchEvents.Remove(matchEvent);
        await dbContext.SaveChangesAsync();
        return matchEvent;
    }

    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchEvent> AddGoalEventAsync(
        NorskballDbContext dbContext,
        string matchId,
        string scorerId,
        string? assisterId,
        string teamId,
        DateTime timestamp,
        int minuteOfMatch,
        bool isOwnGoal = false)
    {
        var matchEvent = new MatchEvent
        {
            Id = Guid.NewGuid().ToString(),
            MatchId = matchId,
            Type = isOwnGoal ? EventType.OwnGoal : EventType.Goal,
            PlayerId = scorerId,
            SecondaryPlayerId = assisterId,
            TeamId = teamId,
            Timestamp = timestamp,
            MinuteOfMatch = minuteOfMatch,
            Description = isOwnGoal ? "Own Goal" : (assisterId != null ? "Goal with assist" : "Goal")
        };

        dbContext.MatchEvents.Add(matchEvent);
        await dbContext.SaveChangesAsync();
        return matchEvent;
    }

    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchEvent> AddCardEventAsync(
        NorskballDbContext dbContext,
        string matchId,
        string playerId,
        string teamId,
        EventType cardType,
        DateTime timestamp,
        int minuteOfMatch)
    {
        if (cardType != EventType.YellowCard && cardType != EventType.RedCard)
            throw new Exception("Card type must be either YellowCard or RedCard");

        var matchEvent = new MatchEvent
        {
            Id = Guid.NewGuid().ToString(),
            MatchId = matchId,
            Type = cardType,
            PlayerId = playerId,
            TeamId = teamId,
            Timestamp = timestamp,
            MinuteOfMatch = minuteOfMatch,
            Description = cardType == EventType.YellowCard ? "Yellow Card" : "Red Card"
        };

        dbContext.MatchEvents.Add(matchEvent);
        await dbContext.SaveChangesAsync();
        return matchEvent;
    }

    [Authorize(Roles = new[] {"admin"})]
    public async Task<MatchEvent> AddSubstitutionEventAsync(
        NorskballDbContext dbContext,
        string matchId,
        string playerOutId,
        string playerInId,
        string teamId,
        DateTime timestamp,
        int minuteOfMatch)
    {
        var matchEvent = new MatchEvent
        {
            Id = Guid.NewGuid().ToString(),
            MatchId = matchId,
            Type = EventType.Substitution,
            PlayerId = playerOutId,
            SecondaryPlayerId = playerInId,
            TeamId = teamId,
            Timestamp = timestamp,
            MinuteOfMatch = minuteOfMatch,
            Description = "Substitution"
        };

        dbContext.MatchEvents.Add(matchEvent);
        await dbContext.SaveChangesAsync();
        return matchEvent;
    }
} 