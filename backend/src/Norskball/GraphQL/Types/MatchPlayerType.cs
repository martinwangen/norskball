using Norskball.Models;

namespace Norskball.GraphQL.Types;

public class MatchPlayerType : ObjectType<MatchPlayer>
{
    protected override void Configure(IObjectTypeDescriptor<MatchPlayer> descriptor)
    {
        descriptor.Description("Represents a player's participation in a match");

        descriptor.Field(mp => mp.Id)
            .Description("The unique identifier for the match player record");

        descriptor.Field(mp => mp.PlayerId)
            .Description("The ID of the player");

        descriptor.Field(mp => mp.TeamId)
            .Description("The ID of the team");

        descriptor.Field(mp => mp.IsStarter)
            .Description("Whether the player started the match");

        descriptor.Field(mp => mp.Position)
            .Description("The player's position in this match");

        descriptor.Field(mp => mp.SubstitutedInAt)
            .Description("When the player was substituted into the match");

        descriptor.Field(mp => mp.SubstitutedOutAt)
            .Description("When the player was substituted out of the match");

        descriptor.Field(mp => mp.Player)
            .Description("The player")
            .Type<PlayerType>();

        descriptor.Field(mp => mp.Team)
            .Description("The team")
            .Type<TeamType>();

        descriptor.Field(mp => mp.Ratings)
            .Description("The ratings this player received for this match")
            .Type<ListType<RatingType>>();

        descriptor.Field(mp => mp.AverageRating)
            .Description("The average rating for this player in this match");
    }
} 