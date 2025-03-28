using Norskball.Models;

namespace Norskball.Services;

public interface IStatisticsService
{
    Task<IEnumerable<TeamPlayerStats>> GetTeamRatingsAsync(string teamId);
    Task<IEnumerable<PlayerStats>> GetTopPlayersAsync(int? limit = 10);
    Task<IEnumerable<DetailedPlayerStats>> GetDetailedPlayerStatsAsync(
        string? sortBy = "averageRating",
        string? sortOrder = "desc",
        DateTime? startDate = null,
        DateTime? endDate = null,
        int? limit = 10);
    Task<PaginatedResponse<Match>> GetAllMatchRatingsOnlyRatedPlayersAsync(
        DateTime? beforeDate = null,
        int? page = 1,
        int? pageSize = 10);
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