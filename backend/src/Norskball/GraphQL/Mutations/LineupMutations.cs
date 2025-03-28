using HotChocolate;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.Models;
using Microsoft.EntityFrameworkCore;
using Norskball.GraphQL.Types;

namespace Norskball.GraphQL.Mutations;

[GraphQLDescription("Represents the available Lineup mutations.")]
[ExtendObjectType(typeof(Mutation))]
public class LineupMutations
{
    public async Task<Lineup> SaveLineupAsync(
        NorskballDbContext dbContext,
        Lineup lineup)
    {
        ValidateLineup(lineup);
        
        var match = await dbContext.Matches
            .FirstOrDefaultAsync(m => m.Id == lineup.MatchId)
            ?? throw new Exception($"Could not find match with ID {lineup.MatchId}");

        // Check for existing lineup with same match and team
        var existingLineup = await dbContext.Lineups
            .Include(l => l.Players)
            .FirstOrDefaultAsync(l => l.MatchId == lineup.MatchId && l.TeamId == lineup.TeamId);

        if (existingLineup != null)
        {
            // Update existing lineup
            existingLineup.Formation = lineup.Formation;
            existingLineup.IsStarting = lineup.IsStarting;
            existingLineup.UpdatedAt = DateTime.UtcNow;
            
            // Update match players
            await UpdateMatchPlayersAsync(dbContext, existingLineup, lineup.Players);
            
            return await dbContext.Lineups
                .Include(l => l.Players)
                .FirstOrDefaultAsync(l => l.Id == existingLineup.Id);
        }
        else
        {
            // Create new lineup
            return await CreateNewLineupAsync(dbContext, lineup, match);
        }
    }

    private void ValidateLineup(Lineup lineup)
    {
        if (lineup == null)
        {
            throw new ArgumentNullException(nameof(lineup));
        }
        if (string.IsNullOrEmpty(lineup.TeamId))
        {
            throw new ArgumentNullException(nameof(lineup.TeamId));
        }
        if (string.IsNullOrEmpty(lineup.MatchId))
        {
            throw new ArgumentNullException(nameof(lineup.MatchId));
        }
        if (lineup.Players == null || !lineup.Players.Any())
        {
            throw new Exception("Cannot create a lineup without any players");
        }
    }

    private async Task<Lineup> CreateNewLineupAsync(NorskballDbContext dbContext, Lineup lineup, Match match)
    {
        lineup.Id = Guid.NewGuid().ToString();
        lineup.CreatedAt = DateTime.UtcNow;
        lineup.UpdatedAt = DateTime.UtcNow;
        var players = lineup.Players;
        lineup.Players = new List<MatchPlayer>();
        
        dbContext.Lineups.Add(lineup);

        if (lineup.TeamId == match.HomeTeamId)
        {
            match.HomeTeamLineupId = lineup.Id;
        }
        else
        {
            match.AwayTeamLineupId = lineup.Id;
        }
        dbContext.Matches.Update(match);

        foreach (var player in players)
        {
            var newMatchPlayer = new MatchPlayer
            {
                Id = Guid.NewGuid().ToString(),
                LineupId = lineup.Id,
                TeamId = lineup.TeamId,
                PlayerId = player.PlayerId,
                IsStarter = true,
                Position = player.Position
            };
            dbContext.MatchPlayers.Add(newMatchPlayer);
        }

        await dbContext.SaveChangesAsync();
        return lineup;
    }

    private async Task UpdateMatchPlayersAsync(NorskballDbContext dbContext, Lineup existingLineup, List<MatchPlayer> newPlayers)
    {
        // Get existing match players
        var existingMatchPlayers = await dbContext.MatchPlayers
            .Where(mp => mp.LineupId == existingLineup.Id)
            .ToListAsync();

        // Create sets for efficient lookup
        var existingPlayerIds = existingMatchPlayers.Select(mp => mp.PlayerId).ToHashSet();
        var newPlayerIds = newPlayers.Select(p => p.PlayerId).ToHashSet();

        // Find players to remove (in existing but not in new)
        var playersToRemove = existingMatchPlayers
            .Where(mp => !newPlayerIds.Contains(mp.PlayerId))
            .ToList();
        
        if (playersToRemove.Any())
        {
            dbContext.MatchPlayers.RemoveRange(playersToRemove);
        }

        // Find players to add (in new but not in existing)
        var playersToAdd = newPlayers
            .Where(player => !existingPlayerIds.Contains(player.PlayerId))
            .Select(player => new MatchPlayer
            {
                Id = Guid.NewGuid().ToString(),
                LineupId = existingLineup.Id,
                TeamId = existingLineup.TeamId,
                PlayerId = player.PlayerId,
                IsStarter = true,
                Position = player.Position
            })
            .ToList();

        if (playersToAdd.Any())
        {
            dbContext.MatchPlayers.AddRange(playersToAdd);
        }

        // Update positions for existing players
        foreach (var existingPlayer in existingMatchPlayers)
        {
            var newPlayer = newPlayers.FirstOrDefault(p => p.PlayerId == existingPlayer.PlayerId);
            if (newPlayer != null)
            {
                existingPlayer.Position = newPlayer.Position;
            }
        }

        await dbContext.SaveChangesAsync();
    }

    public async Task<Lineup> DeleteLineupAsync(
        NorskballDbContext dbContext,
        string id)
    {
        var lineup = await dbContext.Lineups
            .Include(l => l.Players)
            .FirstOrDefaultAsync(l => l.Id == id)
            ?? throw new Exception($"Could not find lineup with ID {id}");

        dbContext.Lineups.Remove(lineup);
        await dbContext.SaveChangesAsync();
        return lineup;
    }
}