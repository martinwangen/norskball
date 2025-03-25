using Norskball.Models;

namespace Norskball.GraphQL.Types;

public class StadiumType : ObjectType<Stadium>
{
    protected override void Configure(IObjectTypeDescriptor<Stadium> descriptor)
    {
        descriptor.Description("Represents a football stadium");

        descriptor.Field(s => s.Name)
            .Description("The name of the stadium");

        descriptor.Field(s => s.City)
            .Description("The city where the stadium is located");

        descriptor.Field(s => s.Surface)
            .Description("The type of playing surface in the stadium");
    }
} 