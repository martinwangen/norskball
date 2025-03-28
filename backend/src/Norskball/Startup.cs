using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.GraphQL.Queries;
using Norskball.GraphQL.Mutations;
using Norskball.Extensions;
using Norskball.Services;
using Serilog;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Norskball.GraphQL.Authorization;
using System.Text.Json.Serialization;

namespace Norskball
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add services to the container.
            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                });
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // Add HttpContextAccessor
            services.AddHttpContextAccessor();

            // Add DbContext
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrEmpty(connectionString))
            {
                // Try to get from DATABASE_URL environment variable
                var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
                if (!string.IsNullOrEmpty(databaseUrl))
                {
                    // Parse the DATABASE_URL format
                    var uri = new Uri(databaseUrl);
                    var userInfo = uri.UserInfo.Split(':');
                    var host = uri.Host;
                    var database = uri.LocalPath.TrimStart('/');
                    
                    connectionString = $"Host={host};Database={database};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
                }
            }

            services.AddDbContext<NorskballDbContext>(options =>
                options.UseNpgsql(connectionString));

            // Register services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IStatisticsService, StatisticsService>();

            // Configure Authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"))),
                    ClockSkew = TimeSpan.Zero, // Reduces the default 5 min clock skew
                    RequireExpirationTime = true
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var authService = context.HttpContext.RequestServices.GetRequiredService<IAuthService>();
                        var userId = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                        
                        if (userId != null)
                        {
                            var user = await authService.GetCurrentUserAsync(userId);
                            if (user == null)
                            {
                                context.Fail("User not found");
                                return;
                            }
                        }
                    }
                };
            });

            services.AddAuthorization();

            // Configure GraphQL
            services
                .AddGraphQLServer()
                .ModifyCostOptions(o => o.EnforceCostLimits = false) //TODO: We should look at costs at one point, and see if we can optimize it.
                .AddQueryType<Query>()
                .AddMutationType<Mutation>()
                .AddType<PlayerQuery>()
                .AddType<TeamQuery>()
                .AddType<MatchQuery>()
                .AddType<MatchPlayerQuery>()
                .AddType<RatingQuery>()
                .AddType<LineupQuery>()
                .AddType<MatchEventQuery>()
                .AddType<StatisticsQuery>()
                .AddType<RefereeQuery>()
                .AddType<PlayerMutations>()
                .AddType<TeamMutations>()
                .AddType<MatchMutations>()
                .AddType<MatchPlayerMutations>()
                .AddType<RatingMutations>()
                .AddType<MatchEventMutations>()
                .AddType<LineupMutations>()
                .AddType<RefereeMutations>()
                .AddAuthorization()
                .AddProjections()
                .AddFiltering()
                .AddSorting();

            // Register the custom authorization handler
            services.AddScoped<HotChocolate.Authorization.IAuthorizationHandler, HotChocolateUserAuthorizationHandler>();

            // Configure CORS
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder
                        .WithOrigins(Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>())
                        .AllowCredentials()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });

            // Add scraper service
            services.AddScoped<PlayerScraper>();

            // Add hosted service to run the scraper
            services.AddHostedService<ScraperHostedService>();

            // Configure Serilog
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.Console()
                .CreateLogger();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Configure the HTTP request pipeline.
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            // Generate schema.graphql when debugging
            app.UseSchemaGeneration();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGraphQL();
                endpoints.MapControllers().AllowAnonymous();
            });
        }
    }
} 