using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Norskball.Data;
using Norskball.Models;

namespace Norskball.Services;

public class PlayerScraper
{
    private readonly NorskballDbContext _dbContext;
    private readonly ILogger<PlayerScraper> _logger;
    private readonly HtmlWeb _web;

    public PlayerScraper(
        NorskballDbContext dbContext,
        ILogger<PlayerScraper> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
        _web = new HtmlWeb();
    }

    public async Task ScrapeAllTeamsAsync(CancellationToken cancellationToken)
    {
        // Fetch all teams
        var teams = await _dbContext.Teams
            .Where(t => t.Website != null)
            .ToListAsync(cancellationToken);

        // Scrape players for each team
        foreach (var team in teams)
        {
            if (string.IsNullOrEmpty(team.Website))
            {
                _logger.LogWarning("Skipping team {TeamName} - no website URL configured", team.Name);
                continue;
            }

            // Get existing players for this team
            var existingPlayers = await _dbContext.Players
                .Where(p => p.TeamId == team.Id)
                .ToListAsync(cancellationToken);

            var existingPlayerMap = existingPlayers.ToDictionary(
                p => $"{p.FirstName} {p.LastName}",
                p => p);

            // Scrape current players
            var currentPlayers = await ScrapeTeamAsync(team);
            
            foreach (var player in currentPlayers)
            {
                var fullName = $"{player.FirstName} {player.LastName}";

                if (existingPlayerMap.TryGetValue(fullName, out var existingPlayer))
                {
                    // Update only if there are changes
                    if (ShouldUpdatePlayer(existingPlayer, player))
                    {
                        existingPlayer.Position = player.Position;
                        existingPlayer.ImageUrl = player.ImageUrl;
                        existingPlayer.UpdatedAt = DateTime.UtcNow;

                        // Only update nationality if we found a non-default value
                        if (player.Nationality != "Norway")
                        {
                            existingPlayer.Nationality = player.Nationality;
                        }

                        // Only update birth date if we found one and didn't have one
                        if (!existingPlayer.DateOfBirth.HasValue && player.DateOfBirth.HasValue)
                        {
                            existingPlayer.DateOfBirth = player.DateOfBirth;
                        }

                        _dbContext.Players.Update(existingPlayer);
                    }
                    existingPlayerMap.Remove(fullName);
                }
                else if (IsValidNewPlayer(player))
                {
                    await _dbContext.Players.AddAsync(player, cancellationToken);
                }
                else
                {
                    _logger.LogInformation("Skipping creation of player {PlayerName} due to missing essential information", fullName);
                }
            }

            // Log players that are no longer with the team
            foreach (var (name, _) in existingPlayerMap)
            {
                _logger.LogInformation("Player {PlayerName} no longer appears on {TeamName}'s roster", name, team.Name);
            }

            // Save changes for this team
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task<IEnumerable<Player>> ScrapeTeamAsync(Team team)
    {
        var players = new List<Player>();
        var squadUrl = $"{team.Website}/lag";
        
        if (team.Id == "16") // VIF special case
        {
            _logger.LogInformation("Scraping VIF squad");
            squadUrl = "https://www.vif-fotball.no/lag/a-laget/spillere";
        }

        _logger.LogInformation("Scraping team {TeamName} from URL: {Url}", team.Name, squadUrl);

        try
        {
            var doc = await _web.LoadFromWebAsync(squadUrl);
            
            // Log the HTML content for debugging
            _logger.LogDebug("HTML Content: {Html}", doc.DocumentNode.OuterHtml);
            
            // Try to find the main container first
            var mainContainer = doc.DocumentNode.SelectSingleNode("//div[contains(@class, 'players')]") ??
                              doc.DocumentNode.SelectSingleNode("//section[contains(@class, 'players')]");

            if (mainContainer == null)
            {
                _logger.LogError("Could not find main players container for team {TeamName}", team.Name);
                return players;
            }

            // Find all section headers first
            var headers = mainContainer.SelectNodes(".//h2");
            if (headers == null)
            {
                _logger.LogError("No section headers found for team {TeamName}", team.Name);
                return players;
            }

            foreach (var header in headers)
            {
                var headerText = header.InnerText.Trim();
                _logger.LogDebug("Found header: {Header}", headerText);

                if (string.IsNullOrEmpty(headerText) || 
                    headerText.Contains("Støtteapparat", StringComparison.OrdinalIgnoreCase) ||
                    headerText.Contains("Staff", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                // Determine position based on header text
                var position = DeterminePosition(headerText);
                if (position == null)
                {
                    _logger.LogWarning("Unknown position for header: {Header}", headerText);
                    continue;
                }

                // Find the player container that follows this header
                var playerContainer = header.ParentNode;
                if (playerContainer == null)
                {
                    _logger.LogWarning("No parent container found for header: {Header}", headerText);
                    continue;
                }

                // Find all player nodes in this container
                var playerNodes = playerContainer.SelectNodes(".//li[contains(@class, 'grid__item')]");
                if (playerNodes == null)
                {
                    _logger.LogWarning("No player nodes found for position: {Position}", position);
                    continue;
                }

                _logger.LogDebug("Found {Count} players for position {Position}", playerNodes.Count, position);

                foreach (var playerNode in playerNodes)
                {
                    // Get player name
                    var nameNode = playerNode.SelectSingleNode(".//div[contains(@class, 'player__name')]");
                    if (nameNode == null)
                    {
                        _logger.LogDebug("No name node found in player element");
                        continue;
                    }

                    var name = nameNode.InnerText.Trim();
                    if (string.IsNullOrEmpty(name))
                    {
                        _logger.LogDebug("Empty name found in player element");
                        continue;
                    }

                    _logger.LogDebug("Processing player: {Name}", name);

                    var nameParts = name.Split(' ');
                    var player = new Player
                    {
                        Id = GeneratePlayerId(name),
                        FirstName = nameParts[0],
                        LastName = string.Join(" ", nameParts.Skip(1)),
                        Position = position,
                        Nationality = "Norway",
                        TeamId = team.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    // Get player image
                    var imageNode = playerNode.SelectSingleNode(".//div[contains(@class, 'player__image')]");
                    if (imageNode != null)
                    {
                        var style = imageNode.GetAttributeValue("style", "");
                        _logger.LogDebug("Found image style: {Style}", style);

                        if (!string.IsNullOrEmpty(style))
                        {
                            // Try to find URL in background-image style
                            var urlMatch = style.Contains("url(") ? style : null;
                            if (urlMatch != null)
                            {
                                var urlStart = style.IndexOf("url(");
                                var urlContent = style[(urlStart + 4)..];
                                var urlEnd = urlContent.IndexOf(")");
                                
                                if (urlEnd > 0)
                                {
                                    var url = urlContent[..urlEnd].Trim('\'', '"');
                                    player.ImageUrl = url;
                                    _logger.LogDebug("Extracted image URL from style: {Url}", url);
                                }
                            }
                            else
                            {
                                _logger.LogDebug("No url() found in style attribute");
                            }
                        }
                        else
                        {
                            // Try to find direct image tag
                            var imgTag = playerNode.SelectSingleNode(".//img");
                            if (imgTag != null)
                            {
                                var src = imgTag.GetAttributeValue("src", "");
                                if (!string.IsNullOrEmpty(src))
                                {
                                    player.ImageUrl = src;
                                    _logger.LogDebug("Found image URL from img tag: {Url}", src);
                                }
                            }
                            else
                            {
                                _logger.LogDebug("No image tag found");
                            }
                        }
                    }
                    else
                    {
                        _logger.LogDebug("No player__image div found for player {Name}", name);
                        
                        // Try alternative image containers
                        var altImageNode = playerNode.SelectSingleNode(".//div[contains(@class, 'image')] | .//div[contains(@class, 'photo')]");
                        if (altImageNode != null)
                        {
                            var style = altImageNode.GetAttributeValue("style", "");
                            _logger.LogDebug("Found alternative image style: {Style}", style);
                            
                            if (!string.IsNullOrEmpty(style) && style.Contains("url("))
                            {
                                var urlStart = style.IndexOf("url(");
                                var urlContent = style[(urlStart + 4)..];
                                var urlEnd = urlContent.IndexOf(")");
                                
                                if (urlEnd > 0)
                                {
                                    var url = urlContent[..urlEnd].Trim('\'', '"');
                                    player.ImageUrl = url;
                                    _logger.LogDebug("Extracted image URL from alternative style: {Url}", url);
                                }
                            }
                        }
                    }

                    // Get player details
                    var detailsList = playerNode.SelectSingleNode(".//dl[contains(@class, 'player__details')]");
                    if (detailsList != null)
                    {
                        var terms = detailsList.SelectNodes(".//dt");
                        var descriptions = detailsList.SelectNodes(".//dd");

                        if (terms != null && descriptions != null && terms.Count == descriptions.Count)
                        {
                            for (var i = 0; i < terms.Count; i++)
                            {
                                var property = terms[i].InnerText.Trim();
                                var value = descriptions[i].InnerText.Trim();

                                _logger.LogDebug("Found detail: {Property} = {Value}", property, value);

                                switch (property.ToLower())
                                {
                                    case "nasjonalitet":
                                        player.Nationality = value;
                                        break;
                                    case "født":
                                        if (ParseNorwegianDate(value) is DateTime birthDate)
                                            player.DateOfBirth = birthDate;
                                        break;
                                }
                            }
                        }
                    }

                    players.Add(player);
                    _logger.LogInformation("Added player {PlayerName} ({Position}) for team {TeamName}", 
                        $"{player.FirstName} {player.LastName}", player.Position, team.Name);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error scraping team {TeamName} from URL {Url}", team.Name, squadUrl);
        }

        _logger.LogInformation("Found {PlayerCount} players for team {TeamName}", players.Count, team.Name);
        return players;
    }

    private Position DeterminePosition(string headerText)
    {
        var text = headerText.ToLower();
        
        // Log the header text we're trying to match
        _logger.LogDebug("Determining position for header: {Header}", headerText);
        
        if (text.Contains("keeper"))
            return Position.Goalkeeper;
        if (text.Contains("forsvar"))
            return Position.Defender;
        if (text.Contains("midtbane"))
            return Position.Midfielder;
        if (text.Contains("angrep") || text.Contains("spiss"))
            return Position.Forward;
            
        return Position.Undefined;
    }

    private static bool ShouldUpdatePlayer(Player existing, Player scraped)
    {
        if (existing.Position != scraped.Position)
            return true;

        if (existing.Nationality == "Norway" && scraped.Nationality != "Norway")
            return true;

        if (!existing.DateOfBirth.HasValue && scraped.DateOfBirth.HasValue)
            return true;

        if (existing.ImageUrl != scraped.ImageUrl)
            return true;

        return false;
    }

    private static bool IsValidNewPlayer(Player player)
    {
        if (string.IsNullOrEmpty(player.FirstName) || 
            string.IsNullOrEmpty(player.LastName))
            return false;

        var hasNationality = player.Nationality != "Norway";
        var hasDateOfBirth = player.DateOfBirth.HasValue;

        return hasNationality || hasDateOfBirth || player.Position != Position.Undefined;
    }

    private static DateTime? ParseNorwegianDate(string date)
    {
        try
        {
            var parts = date.Split('.');
            if (parts.Length != 3)
                return null;

            var day = parts[0].Trim();
            var month = parts[1].Trim().ToLower();
            var year = parts[2].Trim();

            var monthNumber = month switch
            {
                "jan" => 1,
                "feb" => 2,
                "mar" => 3,
                "apr" => 4,
                "mai" => 5,
                "jun" => 6,
                "jul" => 7,
                "aug" => 8,
                "sep" => 9,
                "okt" => 10,
                "nov" => 11,
                "des" => 12,
                _ => 0
            };

            if (monthNumber == 0)
                return null;

            return new DateTime(
                int.Parse(year), 
                monthNumber,
                int.Parse(day),
                0, 0, 0,
                DateTimeKind.Utc);
        }
        catch
        {
            return null;
        }
    }

    private static string GeneratePlayerId(string name)
    {
        var normalized = name.ToLower().Replace(" ", "_");
        return $"player_{normalized}_{DateTime.UtcNow:yyyyMMddHHmmss}";
    }
} 