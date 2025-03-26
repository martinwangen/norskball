using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Authorization;

namespace Norskball.GraphQL.Base
{
    [GraphQLDescription("Represents the mutations available.")]
    [Authorize]
    public class Mutation { }
}
