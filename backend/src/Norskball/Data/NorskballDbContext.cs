using Microsoft.EntityFrameworkCore;
using Norskball.Models;
using Norskball.Models.Auth;

namespace Norskball.Data;

public class NorskballDbContext : DbContext
{
    public NorskballDbContext(DbContextOptions<NorskballDbContext> options)
        : base(options)
    {
    }

    public DbSet<Player> Players { get; set; } = null!;
    public DbSet<Team> Teams { get; set; } = null!;
    public DbSet<Match> Matches { get; set; } = null!;
    public DbSet<MatchEvent> MatchEvents { get; set; } = default!;
    public DbSet<Rating> Ratings { get; set; } = default!;
    public DbSet<Lineup> Lineups { get; set; } = default!;
    public DbSet<MatchPlayer> MatchPlayers { get; set; } = default!;
    public DbSet<User> Users { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Player entity
        modelBuilder.Entity<Player>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired();
            entity.Property(e => e.LastName).IsRequired();
            entity.Property(e => e.TeamId).IsRequired();
            entity.Property(e => e.Nationality).IsRequired();
            entity.Property(e => e.Position).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            // Configure relationship with Team
            entity.HasOne(p => p.Team)
                .WithMany(t => t.Players)
                .HasForeignKey(p => p.TeamId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Team entity
        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.ShortName).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            // Configure Stadium as owned entity
            entity.OwnsOne(t => t.Stadium, stadium =>
            {
                stadium.Property(s => s.Name).IsRequired();
                stadium.Property(s => s.City).IsRequired();
                stadium.Property(s => s.Surface).IsRequired();
            });
        });

        // Configure Match entity
        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.HomeTeamId).IsRequired();
            entity.Property(e => e.AwayTeamId).IsRequired();
            entity.Property(e => e.ScheduledDate).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            // Configure Score as owned entity
            entity.OwnsOne(m => m.Score);

            // Configure relationships with Teams
            entity.HasOne(m => m.HomeTeam)
                .WithMany()
                .HasForeignKey(m => m.HomeTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(m => m.AwayTeam)
                .WithMany()
                .HasForeignKey(m => m.AwayTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure relationships with Lineups
            entity.HasOne(m => m.HomeTeamLineup)
                .WithMany()
                .HasForeignKey(m => m.HomeTeamLineupId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(m => m.AwayTeamLineup)
                .WithMany()
                .HasForeignKey(m => m.AwayTeamLineupId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure MatchEvent entity
        modelBuilder.Entity<MatchEvent>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MatchId).IsRequired();
            entity.Property(e => e.Type).IsRequired();
            entity.Property(e => e.Timestamp).IsRequired();
            entity.Property(e => e.MinuteOfMatch).IsRequired();

            // Configure relationships
            entity.HasOne(me => me.Match)
                .WithMany(m => m.Events)
                .HasForeignKey(me => me.MatchId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(me => me.Player)
                .WithMany()
                .HasForeignKey(me => me.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(me => me.SecondaryPlayer)
                .WithMany()
                .HasForeignKey(me => me.SecondaryPlayerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(me => me.Team)
                .WithMany()
                .HasForeignKey(me => me.TeamId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Rating entity
        modelBuilder.Entity<Rating>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MatchPlayerId).IsRequired();
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Score).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();

            // Ensure score is between 1 and 10
            entity.ToTable(t => t.HasCheckConstraint("CK_Ratings_Score", "\"Score\" >= 1 AND \"Score\" <= 10"));

            // Configure relationship with MatchPlayer
            entity.HasOne(r => r.MatchPlayer)
                .WithMany(mp => mp.Ratings)
                .HasForeignKey(r => r.MatchPlayerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Add unique constraint to prevent multiple ratings from same user
            entity.HasIndex(r => new { r.MatchPlayerId, r.UserId }).IsUnique();
        });

        // Configure Lineup entity
        modelBuilder.Entity<Lineup>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TeamId).IsRequired();
            entity.Property(e => e.MatchId).IsRequired();
            entity.Property(e => e.Formation).IsRequired();
            entity.Property(e => e.IsStarting).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            // Configure relationship with Team
            entity.HasOne(l => l.Team)
                .WithMany()
                .HasForeignKey(l => l.TeamId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure MatchPlayer entity
        modelBuilder.Entity<MatchPlayer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.LineupId).IsRequired();
            entity.Property(e => e.PlayerId).IsRequired();
            entity.Property(e => e.TeamId).IsRequired();
            entity.Property(e => e.Position).IsRequired();

            // Configure relationship with Player
            entity.HasOne(mp => mp.Player)
                .WithMany()
                .HasForeignKey(mp => mp.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure relationship with Lineup
            entity.HasOne(mp => mp.Lineup)
                .WithMany(l => l.Players)
                .HasForeignKey(mp => mp.LineupId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure relationship with Team
            entity.HasOne(mp => mp.Team)
                .WithMany()
                .HasForeignKey(mp => mp.TeamId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ignore computed property
            entity.Ignore(mp => mp.AverageRating);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Picture).IsRequired();
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is Player or Team or Match or Lineup && 
                       (e.State == EntityState.Added || e.State == EntityState.Modified));

        var now = DateTime.UtcNow;
        foreach (var entityEntry in entries)
        {
            switch (entityEntry.Entity)
            {
                case Player player:
                    if (entityEntry.State == EntityState.Added)
                        player.CreatedAt = now;
                    player.UpdatedAt = now;
                    break;
                case Team team:
                    if (entityEntry.State == EntityState.Added)
                        team.CreatedAt = now;
                    team.UpdatedAt = now;
                    break;
                case Match match:
                    if (entityEntry.State == EntityState.Added)
                        match.CreatedAt = now;
                    match.UpdatedAt = now;
                    break;
                case Lineup lineup:
                    if (entityEntry.State == EntityState.Added)
                        lineup.CreatedAt = now;
                    lineup.UpdatedAt = now;
                    break;
            }
        }

        // Set CreatedAt for new ratings
        var ratingEntries = ChangeTracker
            .Entries<Rating>()
            .Where(e => e.State == EntityState.Added);

        foreach (var ratingEntry in ratingEntries)
        {
            ratingEntry.Entity.CreatedAt = now;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
} 