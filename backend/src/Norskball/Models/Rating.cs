using System.ComponentModel.DataAnnotations.Schema;

namespace Norskball.Models;

public class Rating
{
    public string Id { get; set; } = default!;
    public string MatchPlayerId { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public int Score { get; set; }  // 1-10
    public DateTime CreatedAt { get; set; }

    // Navigation property
    [ForeignKey("MatchPlayerId")]
    public MatchPlayer MatchPlayer { get; set; } = default!;
} 