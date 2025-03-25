using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Norskball.Models;

public enum Position
{
    Undefined,
    Goalkeeper,
    Defender,
    Midfielder,
    Forward
}

public class Player
{
    public string Id { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public Position Position { get; set; }= Position.Undefined;
    public string? Nationality { get; set; } = "Norway";
    public string? ImageUrl { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? TeamId { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    [ForeignKey("TeamId")]
    public Team? Team { get; set; } = null!;
} 