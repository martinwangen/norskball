package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/database"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/repository"
	"github.com/martinwangen/norskball/apps/backend/internal/config"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
)

// Fixture represents a match fixture from the JSON file
type Fixture struct {
	HomeTeam  string `json:"hometeam"`
	AwayTeam  string `json:"awayteam"`
	Round     string `json:"round"`
	Timestamp string `json:"timestamp"`
	Arena     string `json:"arena"`
}

func main() {
	// Load configuration
	cfg := config.GetConfig()

	// Initialize database connection
	db, err := database.NewPostgresDB(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize match repository
	matchRepo := repository.NewPostgresMatchRepository(db)

	// Get the absolute path to the fixtures file
	fixturesPath := "./data/eliteserien_fixtures_2025.json"

	// Read fixtures from JSON file
	fixturesData, err := os.ReadFile(fixturesPath)
	if err != nil {
		log.Fatalf("Failed to read fixtures file: %v", err)
	}

	var fixtures []Fixture
	if err := json.Unmarshal(fixturesData, &fixtures); err != nil {
		log.Fatalf("Failed to parse fixtures JSON: %v", err)
	}

	// Create context
	ctx := context.Background()

	// Import each fixture
	for _, fixture := range fixtures {
		// Parse timestamp
		timestamp, err := time.Parse("2006-01-02 15:04:05", fixture.Timestamp)
		if err != nil {
			log.Printf("Failed to parse timestamp for fixture %s vs %s: %v", fixture.HomeTeam, fixture.AwayTeam, err)
			continue
		}

		// Create match
		m := match.NewMatch(
			fixture.HomeTeam, // Using team names as IDs for now
			fixture.AwayTeam,
			"2025",        // Season ID
			"eliteserien", // League ID
			fixture.Arena, // Using arena name as stadium ID for now
			"",            // Referee ID not provided
			timestamp,
		)

		// Set additional match details
		m.Status = match.StatusScheduled

		// Create match in database
		_, err = matchRepo.Create(ctx, m)
		if err != nil {
			log.Printf("Failed to create match %s vs %s: %v", fixture.HomeTeam, fixture.AwayTeam, err)
			continue
		}

		fmt.Printf("Imported fixture: %s vs %s at %s\n", fixture.HomeTeam, fixture.AwayTeam, fixture.Timestamp)
	}

	fmt.Println("Fixture import completed")
}
