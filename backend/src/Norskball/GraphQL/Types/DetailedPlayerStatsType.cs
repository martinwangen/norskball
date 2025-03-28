using Norskball.GraphQL.Queries;
using Norskball.Models;

namespace Norskball.GraphQL.Types;

public class DetailedPlayerStatsType : ObjectType<DetailedPlayerStats>
{
    protected override void Configure(IObjectTypeDescriptor<DetailedPlayerStats> descriptor)
    {
        descriptor.Description("Represents detailed statistics for a player");

        descriptor.Field(s => s.PlayerId)
            .Description("The unique identifier for the player");

        descriptor.Field(s => s.PlayerName)
            .Description("The player's full name");

        descriptor.Field(s => s.Goals)
            .Description("Number of goals scored");

        descriptor.Field(s => s.Assists)
            .Description("Number of assists provided");

        descriptor.Field(s => s.Points)
            .Description("Total points (goals + assists)");

        descriptor.Field(s => s.YellowCards)
            .Description("Number of yellow cards received");

        descriptor.Field(s => s.RedCards)
            .Description("Number of red cards received");

        descriptor.Field(s => s.MatchesPlayed)
            .Description("Number of matches played");

        descriptor.Field(s => s.AverageRating)
            .Description("Average rating received");

        descriptor.Field(s => s.HighestRating)
            .Description("Highest rating received");

        descriptor.Field(s => s.RatingCount)
            .Description("Number of ratings received");
    }
} 