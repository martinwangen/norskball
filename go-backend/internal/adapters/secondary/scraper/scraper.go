package scraper

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gocolly/colly"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/team"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports/"
)

// Scraper handles the scraping of player information
type Scraper struct {
	collector  *colly.Collector
	teamRepo   ports.TeamRepository
	playerRepo ports.PlayerRepository
}

// NewScraper creates a new scraper instance
func NewScraper(teamRepo ports.TeamRepository, playerRepo ports.PlayerRepository) *Scraper {
	c := colly.NewCollector()

	// Add error callback only
	c.OnError(func(r *colly.Response, err error) {
		log.Printf("Error visiting %s: %v", r.Request.URL, err)
	})

	return &Scraper{
		collector:  c,
		teamRepo:   teamRepo,
		playerRepo: playerRepo,
	}
}

// StartPeriodicScraping starts the periodic scraping of all teams and their players
func (s *Scraper) StartPeriodicScraping(ctx context.Context) {
	// Do initial scraping
	if err := s.scrapeAllTeams(ctx); err != nil {
		log.Printf("Error during initial team scraping: %v", err)
	}

	// Start periodic scraping
	ticker := time.NewTicker(1 * time.Hour)
	go func() {
		for {
			select {
			case <-ctx.Done():
				ticker.Stop()
				return
			case <-ticker.C:
				if err := s.scrapeAllTeams(ctx); err != nil {
					log.Printf("Error during periodic team scraping: %v", err)
				}
			}
		}
	}()
}

// scrapeAllTeams fetches all teams and scrapes their players
func (s *Scraper) scrapeAllTeams(ctx context.Context) error {
	pageSize := int32(100)
	var pageToken string
	var teams []*team.Team
	var err error

	// Fetch all teams
	for {
		var batch []*team.Team
		batch, pageToken, err = s.teamRepo.List(ctx, pageSize, pageToken)
		if err != nil {
			return fmt.Errorf("failed to fetch teams: %w", err)
		}

		teams = append(teams, batch...)

		if pageToken == "" {
			break
		}
	}

	// Scrape players for each team
	for _, t := range teams {
		if t.Website == "" {
			log.Printf("Warning: Skipping team %s - no website URL configured", t.Name)
			continue
		}

		// Get existing players for this team
		existingPlayers, _, err := s.playerRepo.List(ctx, 1000, "") // Assuming no team has more than 1000 players
		if err != nil {
			log.Printf("Error fetching existing players for team %s: %v", t.Name, err)
			continue
		}

		// Create a map for quick lookup of existing players
		existingPlayerMap := make(map[string]*player.Player)
		for _, ep := range existingPlayers {
			key := fmt.Sprintf("%s %s", ep.FirstName, ep.LastName)
			existingPlayerMap[key] = ep
		}

		// Scrape current players
		currentPlayers, err := s.ScrapeTeam(t)
		if err != nil {
			log.Printf("Error scraping team %s: %v", t.Name, err)
			continue
		}

		// Process each scraped player
		for _, p := range currentPlayers {
			fullName := fmt.Sprintf("%s %s", p.FirstName, p.LastName)

			// Check if player exists
			if existingPlayer, exists := existingPlayerMap[fullName]; exists {
				// Update only if there are changes
				if shouldUpdatePlayer(existingPlayer, p) {
					p.ID = existingPlayer.ID               // Keep the existing ID
					p.CreatedAt = existingPlayer.CreatedAt // Keep original creation date

					// Preserve any existing data that wasn't found during scraping
					if p.DateOfBirth.IsZero() && !existingPlayer.DateOfBirth.IsZero() {
						p.DateOfBirth = existingPlayer.DateOfBirth
					}
					if p.Nationality == "Norway" && existingPlayer.Nationality != "Norway" {
						p.Nationality = existingPlayer.Nationality
					}

					_, err = s.playerRepo.Update(ctx, p)
					if err != nil {
						log.Printf("Error updating player %s: %v", fullName, err)
					}
				}
				// Remove from map to track which players are no longer with the team
				delete(existingPlayerMap, fullName)
			} else {
				// Only create new player if we have essential information
				if isValidNewPlayer(p) {
					_, err = s.playerRepo.Create(ctx, p)
					if err != nil {
						log.Printf("Error creating player %s: %v", fullName, err)
					}
				} else {
					log.Printf("Skipping creation of player %s due to missing essential information", fullName)
				}
			}
		}

		// Log players that are no longer with the team
		for name := range existingPlayerMap {
			log.Printf("Player %s no longer appears on %s's roster", name, t.Name)
			// Here you could update their status or move them to a historical record
		}
	}

	return nil
}

// shouldUpdatePlayer checks if the scraped player data differs from existing data
func shouldUpdatePlayer(existing, scraped *player.Player) bool {
	// Always update if position changed
	if existing.Position != scraped.Position {
		return true
	}

	// Update if we found new information that was previously default/unknown
	if existing.Nationality == "Norway" && scraped.Nationality != "Norway" {
		return true
	}
	if existing.DateOfBirth.IsZero() && !scraped.DateOfBirth.IsZero() {
		return true
	}
	if existing.ImageURL != scraped.ImageURL {
		return true
	}

	return false
}

// isValidNewPlayer checks if we have enough information to create a new player
func isValidNewPlayer(p *player.Player) bool {
	// Must have name and position
	if p.FirstName == "" || p.LastName == "" || p.Position == "" {
		return false
	}

	// Must have either:
	// - Nationality other than default
	// - Date of birth
	hasNationality := p.Nationality != "Norway"
	hasDateOfBirth := !p.DateOfBirth.IsZero()

	return hasNationality || hasDateOfBirth
}

// ScrapeTeam scrapes the team page and returns a list of players
func (s *Scraper) ScrapeTeam(team *team.Team) ([]*player.Player, error) {
	if team == nil {
		return nil, fmt.Errorf("team cannot be nil")
	}

	if team.Website == "" {
		return nil, fmt.Errorf("team website URL cannot be empty")
	}

	var players []*player.Player

	// Set up callbacks for each player section
	s.collector.OnHTML("span", func(section *colly.HTMLElement) {
		// Get the section header
		header := section.ChildText("h2.players__header")
		if header == "" {
			return // Skip spans without headers
		}

		// Skip staff section
		if header == "Støtteapparat" {
			return
		}

		// Determine position based on header
		var pos string
		switch header {
		case "Keepere":
			pos = "Goalkeeper"
		case "Forsvarsspillere":
			pos = "Defender"
		case "Midtbanespillere":
			pos = "Midfielder"
		case "Angrepsspillere":
			pos = "Forward"
		default:
			log.Printf("Warning: Unknown player section header: %s", header)
			return
		}

		// Process players in this section
		section.ForEach("ul.players__grid li.grid__item", func(_ int, e *colly.HTMLElement) {
			// Extract basic information
			name := e.ChildText(".player__name")
			if name == "" {
				return
			}

			// Split name into first and last name
			nameParts := strings.Split(name, " ")
			first_name := nameParts[0]
			last_name := strings.Join(nameParts[1:], " ")

			// Create new player
			p := &player.Player{
				ID:          generatePlayerID(name),
				FirstName:   first_name,
				LastName:    last_name,
				Position:    pos,
				Nationality: "Norway", // Default nationality (full country name)
				TeamID:      team.ID,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
			}

			// Extract image URL
			style := e.ChildAttr(".player__image", "style")
			if strings.Contains(style, "background-image") {
				urlStart := strings.Index(style, "url('") + 5
				urlEnd := strings.Index(style, "')")
				if urlStart > 4 && urlEnd > urlStart {
					p.ImageURL = style[urlStart:urlEnd]
				}
			}

			// Extract nationality and other details from dl list
			e.ForEach("dl.player__details", func(_ int, dl *colly.HTMLElement) {
				var lastProperty string
				dl.ForEach("dt,dd", func(_ int, elem *colly.HTMLElement) {
					if elem.Name == "dt" {
						lastProperty = elem.Text
					} else if elem.Name == "dd" {
						value := elem.Text
						switch lastProperty {
						case "Nasjonalitet":
							p.Nationality = value
						case "Født":
							// Parse date in format "2. mai. 1997"
							if birthDate, err := parseNorwegianDate(value); err == nil {
								p.DateOfBirth = birthDate
							}
						}
					}
				})
			})
			players = append(players, p)
		})
	})

	// Start scraping
	squadURL := fmt.Sprintf("%s/lag", team.Website)
	if team.ID == "16" {
		log.Printf("Scraping VIF squad")
		squadURL = "https://www.vif-fotball.no/lag/a-laget/spillere"
	}

	err := s.collector.Visit(squadURL)
	if err != nil {
		return nil, fmt.Errorf("failed to scrape team page: %w", err)
	}

	return players, nil
}

// Helper function to parse Norwegian dates
func parseNorwegianDate(date string) (time.Time, error) {
	// Norwegian month names
	months := map[string]string{
		"jan": "01",
		"feb": "02",
		"mar": "03",
		"apr": "04",
		"mai": "05",
		"jun": "06",
		"jul": "07",
		"aug": "08",
		"sep": "09",
		"okt": "10",
		"nov": "11",
		"des": "12",
	}

	// Split the date string
	parts := strings.Split(date, ".")
	if len(parts) != 3 {
		return time.Time{}, fmt.Errorf("invalid date format: %s", date)
	}

	// Clean up parts
	day := strings.TrimSpace(parts[0])
	month := strings.TrimSpace(parts[1])
	year := strings.TrimSpace(parts[2])

	// Convert month name to number
	monthNum, ok := months[month]
	if !ok {
		return time.Time{}, fmt.Errorf("invalid month: %s", month)
	}

	// Format date string
	dateStr := fmt.Sprintf("%s-%s-%s", year, monthNum, day)
	return time.Parse("2006-01-02", dateStr)
}

// generatePlayerID generates a unique ID for a player
func generatePlayerID(name string) string {
	// Replace spaces with underscores and convert to lowercase
	normalized := strings.ToLower(strings.ReplaceAll(name, " ", "_"))
	return fmt.Sprintf("player_%s_%s", normalized, time.Now().Format("20060102150405"))
}
