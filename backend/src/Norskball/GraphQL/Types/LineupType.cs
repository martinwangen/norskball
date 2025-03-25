using Norskball.Models;
using HotChocolate.Types;

namespace Norskball.GraphQL.Types;

public class LineupType : ObjectType<Lineup>
{
    protected override void Configure(IObjectTypeDescriptor<Lineup> descriptor)
    {
        descriptor.Description("Represents a team's lineup for a match");

        descriptor.Field(l => l.Id)
            .Description("The unique identifier for the lineup");

        descriptor.Field(l => l.TeamId)
            .Description("The ID of the team this lineup belongs to");

        descriptor.Field(l => l.MatchId)
            .Description("The ID of the match this lineup belongs to");

        descriptor.Field(l => l.Formation)
            .Description("The formation used in this lineup (e.g. '4-3-3')");

        descriptor.Field(l => l.IsStarting)
            .Description("Whether this is the starting lineup");

        descriptor.Field(l => l.Players)
            .Description("The players in this lineup")
            .Type<ListType<MatchPlayerType>>();

        descriptor.Field(l => l.CreatedAt)
            .Description("When the lineup was created");

        descriptor.Field(l => l.UpdatedAt)
            .Description("When the lineup was last updated");

        descriptor.Field(l => l.Team)
            .Description("The team this lineup belongs to")
            .Type<TeamType>();
    }
} 