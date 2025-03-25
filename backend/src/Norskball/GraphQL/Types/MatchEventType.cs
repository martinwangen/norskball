using Norskball.Models;

namespace Norskball.GraphQL.Types;

public class MatchEventType : ObjectType<MatchEvent>
{
    protected override void Configure(IObjectTypeDescriptor<MatchEvent> descriptor)
    {
        descriptor.Description("Represents an event that occurred during a match");

        descriptor.Field(e => e.Id)
            .Description("The unique identifier for the event");

        descriptor.Field(e => e.MatchId)
            .Description("The ID of the match");

        descriptor.Field(e => e.Type)
            .Description("The type of event");

        descriptor.Field(e => e.Timestamp)
            .Description("When the event occurred");

        descriptor.Field(e => e.MinuteOfMatch)
            .Description("The minute of the match when the event occurred");

        descriptor.Field(e => e.PlayerId)
            .Description("The ID of the primary player involved in the event");

        descriptor.Field(e => e.SecondaryPlayerId)
            .Description("The ID of the secondary player involved (e.g., for substitutions)");

        descriptor.Field(e => e.TeamId)
            .Description("The ID of the team involved in the event");

        descriptor.Field(e => e.Description)
            .Description("Additional details about the event");

        descriptor.Field(e => e.Match)
            .Description("The match")
            .Type<MatchType>();

        descriptor.Field(e => e.Player)
            .Description("The primary player involved")
            .Type<PlayerType>();

        descriptor.Field(e => e.SecondaryPlayer)
            .Description("The secondary player involved")
            .Type<PlayerType>();

        descriptor.Field(e => e.Team)
            .Description("The team involved")
            .Type<TeamType>();
    }
} 