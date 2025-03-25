using Norskball.Models;

namespace Norskball.GraphQL.Types;

public class TeamType : ObjectType<Team>
{
    protected override void Configure(IObjectTypeDescriptor<Team> descriptor)
    {
        descriptor.Description("Represents a football team");

        descriptor.Field(t => t.Id)
            .Description("The unique identifier for the team");

        descriptor.Field(t => t.Name)
            .Description("The full name of the team");

        descriptor.Field(t => t.ShortName)
            .Description("The abbreviated or short name of the team");

        descriptor.Field(t => t.Logo)
            .Description("URL to the team's logo");

        descriptor.Field(t => t.Website)
            .Description("The team's official website");

        descriptor.Field(t => t.Stadium)
            .Description("The team's home stadium")
            .Type<StadiumType>();

        descriptor.Field(t => t.Players)
            .Description("The players in this team")
            .Type<ListType<PlayerType>>();

        descriptor.Field(t => t.CreatedAt)
            .Description("When the team record was created");

        descriptor.Field(t => t.UpdatedAt)
            .Description("When the team record was last updated");
    }
} 