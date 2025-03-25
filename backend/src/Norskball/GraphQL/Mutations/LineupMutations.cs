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

        if (string.IsNullOrEmpty(lineup.Id))
        {
            lineup = await CreateNewLineupAsync(dbContext, lineup, match);
        }
        else
        {
            lineup = await UpdateExistingLineupAsync(dbContext, lineup);
        }

        await UpdateMatchPlayersAsync(dbContext, lineup);
        
        return await dbContext.Lineups
            .Include(l => l.Players)
            .FirstOrDefaultAsync(l => l.Id == lineup.Id);
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

    private async Task<Lineup> UpdateExistingLineupAsync(NorskballDbContext dbContext, Lineup lineup)
    {
        var existing = await dbContext.Lineups
            .Include(l => l.Players)
            .FirstOrDefaultAsync(l => l.Id == lineup.Id)
            ?? throw new Exception($"Could not find lineup with ID {lineup.Id}");

        existing.Formation = lineup.Formation;
        existing.IsStarting = lineup.IsStarting;
        existing.UpdatedAt = DateTime.UtcNow;
        
        await dbContext.SaveChangesAsync();
        return existing;
    }

    private async Task UpdateMatchPlayersAsync(NorskballDbContext dbContext, Lineup lineup)
    {
        var playerIds = lineup.Players.Select(p => p.Id).ToList();
        var existingMatchPlayers = await dbContext.MatchPlayers
            .Where(mp => mp.LineupId == lineup.Id)
            .ToListAsync();

        var existingPlayerIds = existingMatchPlayers.Select(mp => mp.PlayerId).ToHashSet();

        var playersToRemove = existingMatchPlayers
            .Where(mp => !playerIds.Contains(mp.PlayerId))
            .ToList();
        
        if (playersToRemove.Any())
        {
            dbContext.MatchPlayers.RemoveRange(playersToRemove);
        }

        var newMatchPlayers = lineup.Players
            .Where(player => !existingPlayerIds.Contains(player.Id))
            .Select(player => new MatchPlayer
            {
                Id = Guid.NewGuid().ToString(),
                LineupId = lineup.Id,
                TeamId = lineup.TeamId,
                PlayerId = player.PlayerId,
                IsStarter = true,
                Position = player.Position
            })
            .ToList();

        if (newMatchPlayers.Any())
        {
            dbContext.MatchPlayers.AddRange(newMatchPlayers);
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