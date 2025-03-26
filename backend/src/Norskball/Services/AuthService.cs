using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Norskball.Data;
using Norskball.Models.Auth;

namespace Norskball.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly NorskballDbContext _context;
    private readonly string _googleClientId;

    public AuthService(IConfiguration configuration, NorskballDbContext context)
    {
        _configuration = configuration;
        _context = context;
        _googleClientId = _configuration["Google:ClientId"] ?? throw new InvalidOperationException("Google ClientId not configured");
    }

    public async Task<(User user, string token)> AuthenticateGoogleUserAsync(GoogleAuthRequest request)
    {
        // Verify the Google token
        var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { _googleClientId }
        });

        if (payload.Email != request.Email)
        {
            throw new InvalidOperationException("Email mismatch in Google token");
        }

        // Get or create user
        var user = await GetUserByEmailAsync(request.Email);
        if (user == null)
        {
            // Create new user with default role
            user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = request.Email,
                Name = request.Name,
                Picture = request.Picture,
                Roles = new List<string> { "user" }
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else
        {
            // Update existing user's information
            user.Name = request.Name;
            user.Picture = request.Picture;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        // Generate JWT token
        var token = GenerateJwtToken(user);

        return (user, token);
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };

        // Add roles to claims
        if (user.Roles != null)
        {
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<User?> GetCurrentUserAsync(string userId)
    {
        return await _context.Users.FindAsync(userId);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }
} 