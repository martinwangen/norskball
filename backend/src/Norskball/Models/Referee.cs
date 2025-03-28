using System;
using System.Collections.Generic;

namespace Norskball.Models;

public class Referee
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<Match> Matches { get; set; } = new List<Match>();
} 