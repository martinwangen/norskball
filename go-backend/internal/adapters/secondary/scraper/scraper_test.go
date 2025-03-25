package scraper

import (
	"testing"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/team"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports/player/mocks"
	teamMocks "github.com/martinwangen/norskball/apps/backend/internal/core/ports/team/mocks"
	"go.uber.org/mock/gomock"
)

func TestScraper_ScrapeTeam_HamKam(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockTeamRepo := teamMocks.NewMockRepository(ctrl)
	mockPlayerRepo := mocks.NewMockRepository(ctrl)

	// Create a test team
	testTeam := &team.Team{
		ID:   "16",
		Name: "VIF",
	}

	scraper := NewScraper(mockTeamRepo, mockPlayerRepo)
	players, err := scraper.ScrapeTeam(testTeam)
	if err != nil {
		t.Fatalf("Failed to scrape team: %v", err)
	}

	if len(players) == 0 {
		t.Error("Expected to find players, but got none")
	}
	if len(players) != 27 {
		t.Errorf("Expected 27 players, got %d", len(players))
		t.Logf("%v Players: %v", len(players), players)
	}

	// Test a few players to make sure we're getting the data correctly
	for _, player := range players {
		if player.first_name == "" {
			t.Errorf("Player first name should not be empty")
		}
		if player.last_name == "" {
			t.Errorf("Player last name should not be empty")
		}
		if player.Position == "" {
			t.Errorf("Player position should not be empty for player %s %s", player.first_name, player.last_name)
		}
		if player.ID == "" {
			t.Errorf("Player ID should not be empty for player %s %s", player.first_name, player.last_name)
		}
		if player.Contract.Club != testTeam.Name {
			t.Errorf("Player team name should match test team name. Expected %s, got %s", testTeam.Name, player.Contract.Club)
		}
	}
}

func TestScraper_ScrapeTeam_FKH(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockTeamRepo := teamMocks.NewMockRepository(ctrl)
	mockPlayerRepo := mocks.NewMockRepository(ctrl)

	// Create a test team
	testTeam := &team.Team{
		ID:      "test_team_2",
		Name:    "FK Haugesund",
		Website: "https://www.fkh.no",
	}
	scraper := NewScraper(mockTeamRepo, mockPlayerRepo)
	players, err := scraper.ScrapeTeam(testTeam)
	if err != nil {
		t.Fatalf("Failed to scrape team: %v", err)
	}

	if len(players) == 0 {
		t.Error("Expected to find players, but got none")
	}
	if len(players) != 26 {
		t.Errorf("Expected 26 players, got %d", len(players))
		t.Logf("%v Players: %v", len(players), players)
	}

	// Test a few players to make sure we're getting the data correctly
	for _, player := range players {
		if player.first_name == "" {
			t.Errorf("Player first name should not be empty")
		}
		if player.last_name == "" {
			t.Errorf("Player last name should not be empty")
		}
		if player.Position == "" {
			t.Errorf("Player position should not be empty for player %s %s", player.first_name, player.last_name)
		}
		if player.ID == "" {
			t.Errorf("Player ID should not be empty for player %s %s", player.first_name, player.last_name)
		}
		if player.Contract.Club != testTeam.Name {
			t.Errorf("Player team name should match test team name. Expected %s, got %s", testTeam.Name, player.Contract.Club)
		}
	}
}
