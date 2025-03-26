namespace Norskball.Models.Auth;

public class AuthResponse
{
    public User User { get; set; } = null!;
    public string Token { get; set; } = string.Empty;
} 