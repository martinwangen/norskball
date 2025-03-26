using Norskball.Models.Auth;

namespace Norskball.Services;

public interface IAuthService
{
    Task<(User user, string token)> AuthenticateGoogleUserAsync(GoogleAuthRequest request);
    Task<User?> GetCurrentUserAsync(string userId);
    Task<User?> GetUserByEmailAsync(string email);
} 