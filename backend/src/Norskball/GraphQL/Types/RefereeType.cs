using Norskball.Models;
using HotChocolate.Types;

namespace Norskball.GraphQL.Types;

public class RefereeType : ObjectType<Referee>
{
    protected override void Configure(IObjectTypeDescriptor<Referee> descriptor)
    {
        descriptor.Description("Represents a football referee");

        descriptor.Field(r => r.Id)
            .Description("The unique identifier for the referee");

        descriptor.Field(r => r.Name)
            .Description("The name of the referee");

        descriptor.Field(r => r.PhotoUrl)
            .Description("URL to the referee's photo");

        descriptor.Field(r => r.CreatedAt)
            .Description("When the referee record was created");

        descriptor.Field(r => r.UpdatedAt)
            .Description("When the referee record was last updated");

        descriptor.Field(r => r.Matches)
            .Description("The matches this referee has officiated")
            .Type<ListType<MatchType>>();
    }
} 