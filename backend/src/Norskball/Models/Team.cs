using System;
using System.Collections.Generic;

namespace Norskball.Models;

public class Team
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string ShortName { get; set; } = default!;
    public string? Logo { get; set; }
    public string? Website { get; set; }
    public Stadium? Stadium { get; set; } = default!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property for players
    public ICollection<Player>? Players { get; set; } = new List<Player>();
} 