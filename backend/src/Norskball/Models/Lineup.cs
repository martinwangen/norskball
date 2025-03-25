using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Norskball.Models;


public enum Formation
{
    [GraphQLDescription("Custom")]
    FormationCustom,
    [GraphQLDescription("4-4-2")]
    Formation442,
    [GraphQLDescription("4-3-3")]
    Formation433,
    [GraphQLDescription("3-5-2")]
    Formation352,
    [GraphQLDescription("3-4-3")]
    Formation343,
    [GraphQLDescription("4-2-3-1")]
    Formation4231,
    [GraphQLDescription("4-3-2-1")]
    Formation4321,
    [GraphQLDescription("5-3-2")]
    Formation532,
    [GraphQLDescription("5-4-1")]
    Formation541,
    [GraphQLDescription("4-5-1")]
    Formation451,
    [GraphQLDescription("5-2-3")]
    Formation523,
    [GraphQLDescription("4-1-4-1")]
    Formation4141,
    [GraphQLDescription("3-1-4-2")]
    Formation3142,
}

[GraphQLDescription("Represents a lineup in a match.")]
public class Lineup
{
    public string Id { get; set; } = default!;
    public string TeamId { get; set; } = default!;
    
    public string MatchId { get; set; } = default!;
    public Formation Formation { get; set; }
    public bool IsStarting { get; set; }
    public List<MatchPlayer> Players { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    [ForeignKey("TeamId")]
    public Team? Team { get; set; } = default!;
} 