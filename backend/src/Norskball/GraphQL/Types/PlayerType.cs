using Norskball.Models;

namespace Norskball.GraphQL.Types;

public class PlayerType : ObjectType<Player>
{
    protected override void Configure(IObjectTypeDescriptor<Player> descriptor)
    {
        descriptor.Description("Represents a football player");

        descriptor.Field(p => p.Id)
            .Description("The unique identifier for the player");

        descriptor.Field(p => p.FirstName)
            .Description("The player's first name");

        descriptor.Field(p => p.LastName)
            .Description("The player's last name");

        descriptor.Field(p => p.TeamId)
            .Description("The ID of the team the player belongs to");

        descriptor.Field(p => p.Nationality)
            .Description("The player's nationality");

        descriptor.Field(p => p.DateOfBirth)
            .Description("The player's date of birth");

        descriptor.Field(p => p.Position)
            .Description("The player's position on the field");

        descriptor.Field(p => p.ImageUrl)
            .Description("URL to the player's image");

        descriptor.Field(p => p.CreatedAt)
            .Description("When the player record was created");

        descriptor.Field(p => p.UpdatedAt)
            .Description("When the player record was last updated");
    }
} 