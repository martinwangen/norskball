using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Norskball.Services;

public class ScraperHostedService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ScraperHostedService> _logger;
    private CancellationTokenSource? _cancellationTokenSource;

    public ScraperHostedService(
        IServiceProvider serviceProvider,
        ILogger<ScraperHostedService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        return; //TODO: implement this again once deploying to production
        _logger.LogInformation("Starting player scraper service");
        _cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

        // Create a scope to resolve scoped services
        using var scope = _serviceProvider.CreateScope();
        var scraper = scope.ServiceProvider.GetRequiredService<PlayerScraper>();
        
        // Start immediate scraping
        try
        {
            _logger.LogInformation("Starting initial scraping on startup");
            await scraper.ScrapeAllTeamsAsync(_cancellationTokenSource.Token);
            _logger.LogInformation("Initial scraping completed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during initial scraping on startup");
        }
        
        // Start the periodic scraping in the background
        _ = RunPeriodicScrapingAsync(_cancellationTokenSource.Token);
        
        return;
    }

    private async Task RunPeriodicScrapingAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromHours(1), cancellationToken);
            
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var scraper = scope.ServiceProvider.GetRequiredService<PlayerScraper>();
                await scraper.ScrapeAllTeamsAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during periodic scraping");
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Stopping player scraper service");
        
        if (_cancellationTokenSource != null)
        {
            _cancellationTokenSource.Cancel();
            _cancellationTokenSource.Dispose();
            _cancellationTokenSource = null;
        }
        
        return Task.CompletedTask;
    }
} 