using HotChocolate.Execution;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using HotChocolate.Authorization;
using Norskball.Data;
using Norskball.Services;

namespace Norskball.GraphQL.Authorization;

public class HotChocolateUserAuthorizationHandler : IAuthorizationHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IAuthService _authService;

    public HotChocolateUserAuthorizationHandler(IHttpContextAccessor httpContextAccessor, IAuthService authService)
    {
        _httpContextAccessor = httpContextAccessor;
        _authService = authService;
    }

    public async ValueTask<AuthorizeResult> AuthorizeAsync(IMiddlewareContext context, AuthorizeDirective directive, CancellationToken cancellationToken = default)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return AuthorizeResult.NotAllowed;
        }

        var user = httpContext.User;
        if (!user.Identity?.IsAuthenticated ?? true)
        {
            return AuthorizeResult.NotAllowed;
        }

        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return AuthorizeResult.NotAllowed;
        }

        // Get the current user from the database to ensure roles are up to date
        var dbUser = await _authService.GetCurrentUserAsync(userId);
        if (dbUser == null)
        {
            return AuthorizeResult.NotAllowed;
        }

        // Check if the user has any of the required roles
        if (directive.Roles?.Any() == true)
        {
            var hasRequiredRole = directive.Roles.Any(role => dbUser.Roles.Contains(role));
            return hasRequiredRole ? AuthorizeResult.Allowed : AuthorizeResult.NotAllowed;
        }

        // If no roles are specified, just check if the user is authenticated
        return AuthorizeResult.Allowed;
    }

    public async ValueTask<AuthorizeResult> AuthorizeAsync(AuthorizationContext context, IReadOnlyList<AuthorizeDirective> directives, CancellationToken cancellationToken = default)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return AuthorizeResult.NotAllowed;
        }

        var user = httpContext.User;
        if (!user.Identity?.IsAuthenticated ?? true)
        {
            return AuthorizeResult.NotAllowed;
        }

        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return AuthorizeResult.NotAllowed;
        }

        // Get the current user from the database to ensure roles are up to date
        var dbUser = await _authService.GetCurrentUserAsync(userId);
        if (dbUser == null)
        {
            return AuthorizeResult.NotAllowed;
        }

        // Check if the user has any of the required roles from all directives
        foreach (var directive in directives)
        {
            if (directive.Roles?.Any() == true)
            {
                var hasRequiredRole = directive.Roles.Any(role => dbUser.Roles.Contains(role));
                if (!hasRequiredRole)
                {
                    return AuthorizeResult.NotAllowed;
                }
            }
        }

        // If no roles are specified or all role checks passed, allow access
        return AuthorizeResult.Allowed;
    }
} 