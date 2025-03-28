using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
 
namespace Norskball.Models;

public class Match
{
    //[Column(TypeName = "nvarchar(36)")]
    public string Id { get; set; } = default!;
    public string HomeTeamId { get; set; } = default!;
    public string AwayTeamId { get; set; } = default!;
    public string? HomeTeamLineupId { get; set; }
    public string? AwayTeamLineupId { get; set; }
    public Guid? RefereeId { get; set; }
    public DateTime ScheduledDate { get; set; }
    public Status Status { get; set; }
    public Score? Score { get; set; } = new();
    public int? Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    [ForeignKey("HomeTeamId")]
    public Team? HomeTeam { get; set; }
    [ForeignKey("AwayTeamId")]
    public Team? AwayTeam { get; set; }
        
    public ICollection<MatchEvent>? Events { get; set; } = new List<MatchEvent>();
    
    [ForeignKey("HomeTeamLineupId")]
    public Lineup? HomeTeamLineup { get; set; }

    [ForeignKey("AwayTeamLineupId")]
    public Lineup? AwayTeamLineup { get; set; }

    [ForeignKey("RefereeId")]
    public Referee? Referee { get; set; }
}