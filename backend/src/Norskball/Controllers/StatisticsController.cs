using Microsoft.AspNetCore.Mvc;
using Norskball.Models;
using Norskball.Services;

namespace Norskball.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;

        public StatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        [HttpGet("team/{teamId}/ratings")]
        public async Task<ActionResult<IEnumerable<TeamPlayerStats>>> GetTeamRatings(string teamId)
        {
            try
            {
                var stats = await _statisticsService.GetTeamRatingsAsync(teamId);
                return Ok(stats);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving team ratings" });
            }
        }

        [HttpGet("players/top")]
        public async Task<ActionResult<IEnumerable<PlayerStats>>> GetTopPlayers([FromQuery] int? limit = 10)
        {
            try
            {
                var stats = await _statisticsService.GetTopPlayersAsync(limit);
                return Ok(stats);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving top players" });
            }
        }

        [HttpGet("players/detailed")]
        public async Task<ActionResult<IEnumerable<DetailedPlayerStats>>> GetDetailedPlayerStats(
            [FromQuery] string? sortBy = "averageRating",
            [FromQuery] string? sortOrder = "desc",
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] int? limit = 10)
        {
            try
            {
                var stats = await _statisticsService.GetDetailedPlayerStatsAsync(
                    sortBy, sortOrder, startDate, endDate, limit);
                return Ok(stats);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving detailed player stats" });
            }
        }

        [HttpGet("/api/matches/ratings")]
        public async Task<ActionResult<PaginatedResponse<Match>>> GetAllMatchRatingsOnlyRatedPlayers(
            [FromQuery] DateTime? beforeDate = null,
            [FromQuery] int? page = 1,
            [FromQuery] int? pageSize = 10)
        {
            try
            {
                var response = await _statisticsService.GetAllMatchRatingsOnlyRatedPlayersAsync(
                    beforeDate, page, pageSize);
                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving match ratings" });
            }
        }

        [HttpGet("/api/matches/ratings/elementor")]
        public async Task<ActionResult<ElementorMatchRatingsResponse>> GetMatchRatingsForElementor(
            [FromQuery] DateTime? beforeDate = null)
        {
            try
            {
                var response = await _statisticsService.GetAllMatchRatingsOnlyRatedPlayersAsync(
                    beforeDate, 1, 100); // Get up to 100 matches for Elementor

                var elementorResponse = new ElementorMatchRatingsResponse
                {
                    TotalCount = response.TotalCount,
                    TotalPages = response.TotalPages,
                    CurrentPage = response.CurrentPage,
                    PageSize = response.PageSize,
                    Items = response.Items.Select(m => new ElementorMatch
                    {
                        Id = m.Id.ToString(),
                        ScheduledDate = m.ScheduledDate,
                        Score = new ElementorScore
                        {
                            HomeTeamScore = m.Score.HomeTeamScore,
                            AwayTeamScore = m.Score.AwayTeamScore
                        },
                        HomeTeam = new ElementorTeam
                        {
                            Id = m.HomeTeam.Id.ToString(),
                            Name = m.HomeTeam.Name,
                            Logo = m.HomeTeam.Logo,
                            Lineup = m.HomeTeamLineup != null ? new ElementorLineup
                            {
                                Id = m.HomeTeamLineup.Id.ToString(),
                                Players = m.HomeTeamLineup.Players.Select(p => new ElementorPlayer
                                {
                                    Id = p.Id.ToString(),
                                    FirstName = p.PlayerId?.Split('_')[1] ?? "",
                                    LastName = p.PlayerId?.Split('_')[2] ?? "",
                                    Position = p.Position,
                                    AverageRating = p.Ratings.Any() ? p.Ratings.Average(r => r.Score) : 0
                                }).ToList()
                            } : null
                        },
                        AwayTeam = new ElementorTeam
                        {
                            Id = m.AwayTeam.Id.ToString(),
                            Name = m.AwayTeam.Name,
                            Logo = m.AwayTeam.Logo,
                            Lineup = m.AwayTeamLineup != null ? new ElementorLineup
                            {
                                Id = m.AwayTeamLineup.Id.ToString(),
                                Players = m.AwayTeamLineup.Players.Select(p => new ElementorPlayer
                                {
                                    Id = p.Id.ToString(),
                                    FirstName = p.PlayerId?.Split('_')[1] ?? "",
                                    LastName = p.PlayerId?.Split('_')[2] ?? "",
                                    Position = p.Position,
                                    AverageRating = p.Ratings.Any() ? p.Ratings.Average(r => r.Score) : 0
                                }).ToList()
                            } : null
                        }
                    }).ToList()
                };

                return Ok(elementorResponse);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving match ratings" });
            }
        }
    }

    public class TeamPlayerStats
    {
        public string PlayerId { get; set; } = default!;
        public string PlayerName { get; set; } = default!;
        public double AverageRating { get; set; }
        public int RatingCount { get; set; }
        public int MatchesPlayed { get; set; }
    }

    public class PlayerStats
    {
        public string PlayerId { get; set; } = default!;
        public string PlayerName { get; set; } = default!;
        public double AverageRating { get; set; }
        public int RatingCount { get; set; }
        public int MatchesPlayed { get; set; }
    }

    public class DetailedPlayerStats
    {
        public string PlayerId { get; set; } = default!;
        public string PlayerName { get; set; } = default!;
        public int Goals { get; set; }
        public int Assists { get; set; }
        public int Points { get; set; }
        public int YellowCards { get; set; }
        public int RedCards { get; set; }
        public int MatchesPlayed { get; set; }
        public double AverageRating { get; set; }
        public double HighestRating { get; set; }
        public int RatingCount { get; set; }
    }

    public class PaginatedResponse<T>
    {
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public List<T> Items { get; set; } = new();
    }

    public class ElementorMatchRatingsResponse
    {
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public List<ElementorMatch> Items { get; set; } = new();
    }

    public class ElementorMatch
    {
        public string Id { get; set; } = default!;
        public DateTime ScheduledDate { get; set; }
        public ElementorScore Score { get; set; } = default!;
        public ElementorTeam HomeTeam { get; set; } = default!;
        public ElementorTeam AwayTeam { get; set; } = default!;
    }

    public class ElementorScore
    {
        public int HomeTeamScore { get; set; }
        public int AwayTeamScore { get; set; }
    }

    public class ElementorTeam
    {
        public string Id { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Logo { get; set; } = default!;
        public ElementorLineup? Lineup { get; set; }
    }

    public class ElementorLineup
    {
        public string Id { get; set; } = default!;
        public List<ElementorPlayer> Players { get; set; } = new();
    }

    public class ElementorPlayer
    {
        public string Id { get; set; } = default!;
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string Position { get; set; } = default!;
        public double AverageRating { get; set; }
    }
} 