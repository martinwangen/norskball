using System.Security.Claims;
using HotChocolate;
using Norskball.Services;
using HotChocolate.Types;
using Norskball.GraphQL.Base;

namespace Norskball.GraphQL.Queries
{
    [ExtendObjectType(typeof(Query))]
    public class MeQuery
    {
        public async Task<object?> GetMe(
            [Service] IAuthService authService,
            ClaimsPrincipal claimsPrincipal)
        {
            var userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return null;
            }

            var user = await authService.GetCurrentUserAsync(userId);
            return user;
        }
    }
} 