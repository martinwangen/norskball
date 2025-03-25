using System.ComponentModel.DataAnnotations.Schema;

namespace Norskball.Models;

public class MatchPlayer
{
    public string Id { get; set; } = default!;
    public string LineupId { get; set; } = default!;
    public string PlayerId { get; set; } = default!;
    public string TeamId { get; set; } = default!;
    public bool IsStarter { get; set; }
    public string Position { get; set; } = default!;
    public DateTime? SubstitutedInAt { get; set; }
    public DateTime? SubstitutedOutAt { get; set; }

    // Navigation properties
    [ForeignKey("PlayerId")]
    public Player? Player { get; set; } = default!;
    [ForeignKey("LineupId")]
    public Lineup? Lineup { get; set; } = default!;
    [ForeignKey("TeamId")]
    public Team? Team { get; set; } = default!;
    public ICollection<Rating>? Ratings { get; set; } = new List<Rating>();

    // Computed property for average rating
    public double? AverageRating => Ratings?.Any() == true ? Math.Round(Ratings.Average(r => r.Score), 1) : null;
} 