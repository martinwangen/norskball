using Microsoft.EntityFrameworkCore;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.GraphQL.Queries;
using Norskball.GraphQL.Mutations;
using Norskball.Extensions;
using Norskball.Services;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Authorization;
using Serilog;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Options;

namespace Norskball
{
    public class Startup
    {
        private const string ApiKey = "rabonaPod"; // Hardcoded API key

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add DbContext
            services.AddDbContext<NorskballDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // Configure API Key Authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "ApiKey";
                options.DefaultChallengeScheme = "ApiKey";
            })
            .AddScheme<AuthenticationSchemeOptions, ApiKeyAuthHandler>("ApiKey", options => { });

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
                .AddType<PlayerMutations>()
                .AddType<TeamMutations>()
                .AddType<MatchMutations>()
                .AddType<MatchPlayerMutations>()
                .AddType<RatingMutations>()
                .AddType<MatchEventMutations>()
                .AddType<LineupMutations>()
                .AddAuthorization()
                .AddProjections()
                .AddFiltering()
                .AddSorting();

            // Add CORS if needed
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
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
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            
            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();

            // Generate schema.graphql when debugging
            app.UseSchemaGeneration();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGraphQL().RequireAuthorization();
            });
        }
    }

    public class ApiKeyAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private const string ApiKey = "rabonaPod"; // Same API key as above

        public ApiKeyAuthHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,     
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("X-API-Key", out var apiKeyHeaderValues))
            {
                return Task.FromResult(AuthenticateResult.Fail("API Key is missing"));
            }

            var providedApiKey = apiKeyHeaderValues.ToString();

            if (providedApiKey != ApiKey)
            {
                return Task.FromResult(AuthenticateResult.Fail("Invalid API Key"));
            }

            var claims = new[] {
                new Claim(ClaimTypes.Name, "ApiUser"),
            };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
} 