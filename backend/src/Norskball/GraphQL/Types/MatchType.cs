using Norskball.Models;
using HotChocolate.Types;

namespace Norskball.GraphQL.Types;

public class MatchType : ObjectType<Match>
{
    protected override void Configure(IObjectTypeDescriptor<Match> descriptor)
    {
        descriptor.Description("Represents a football match");

        descriptor.Field(m => m.Id)
            .Description("The unique identifier for the match");

        descriptor.Field(m => m.HomeTeamId)
            .Description("The ID of the home team");

        descriptor.Field(m => m.AwayTeamId)
            .Description("The ID of the away team");

        descriptor.Field(m => m.ScheduledDate)
            .Description("When the match is scheduled to be played");

        descriptor.Field(m => m.Status)
            .Description("The current status of the match");

        descriptor.Field(m => m.Score)
            .Description("The current score of the match")
            .Type<ScoreType>();

        descriptor.Field(m => m.CreatedAt)
            .Description("When the match record was created");

        descriptor.Field(m => m.UpdatedAt)
            .Description("When the match record was last updated");

        descriptor.Field(m => m.HomeTeam)
            .Description("The home team")
            .Type<TeamType>();

        descriptor.Field(m => m.AwayTeam)
            .Description("The away team")
            .Type<TeamType>();

        descriptor.Field(m => m.Events)
            .Description("The events that occurred during the match")
            .Type<ListType<MatchEventType>>();

        descriptor.Field(m => m.HomeTeamLineup)
            .Description("The home team's lineup for this match")
            .Type<LineupType>();

        descriptor.Field(m => m.AwayTeamLineup)
            .Description("The away team's lineup for this match")
            .Type<LineupType>();
    }
} 