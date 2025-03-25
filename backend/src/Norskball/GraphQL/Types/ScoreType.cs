using Norskball.Models;

namespace Norskball.GraphQL.Types;

public class ScoreType : ObjectType<Score>
{
    protected override void Configure(IObjectTypeDescriptor<Score> descriptor)
    {
        descriptor.Description("Represents a match score");

        descriptor.Field(s => s.HomeTeamScore)
            .Description("The home team's score");

        descriptor.Field(s => s.AwayTeamScore)
            .Description("The away team's score");
    }
} 