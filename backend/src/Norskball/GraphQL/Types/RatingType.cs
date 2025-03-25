using Norskball.Models;

namespace Norskball.GraphQL.Types;

public class RatingType : ObjectType<Rating>
{
    protected override void Configure(IObjectTypeDescriptor<Rating> descriptor)
    {
        descriptor.Description("Represents a player rating for a specific match");

        descriptor.Field(r => r.Id)
            .Description("The unique identifier for the rating");

        descriptor.Field(r => r.MatchPlayerId)
            .Description("The ID of the match player this rating is for");

        descriptor.Field(r => r.UserId)
            .Description("The ID of the user who submitted this rating");

        descriptor.Field(r => r.Score)
            .Description("The rating score (1-10)");

        descriptor.Field(r => r.CreatedAt)
            .Description("When this rating was submitted");

        descriptor.Field(r => r.MatchPlayer)
            .Description("The match player this rating is for")
            .Type<MatchPlayerType>();
    }
} 