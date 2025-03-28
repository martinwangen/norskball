using System.ComponentModel.DataAnnotations.Schema;

namespace Norskball.Models;
public enum EventType
{
    Goal,
    OwnGoal,
    YellowCard,
    RedCard,
    Substitution,
    PenaltyScored,
    PenaltyMissed,
    GameStart,
    GameEnd,
    HalfTimeStart,
    HalfTimeEnd
}

public class MatchEvent
{
    public string Id { get; set; } = default!;
    public string MatchId { get; set; } = default!;
    public EventType Type { get; set; }
    public DateTime Timestamp { get; set; }
    public int MinuteOfMatch { get; set; }
    public string? PlayerId { get; set; }  // Primary player involved
    public string? SecondaryPlayerId { get; set; }  // For events like substitutions (player coming in) or assists
    public string? TeamId { get; set; }
    public string? Description { get; set; }

    // Navigation properties
    [ForeignKey("MatchId")]
    public Match? Match { get; set; } = default!;
    [ForeignKey("PlayerId")]
    public Player? Player { get; set; }
    [ForeignKey("SecondaryPlayerId")]
    public Player? SecondaryPlayer { get; set; }
    [ForeignKey("TeamId")]
    public Team? Team { get; set; }
} 