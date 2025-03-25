package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/machinebox/graphql"
)

var (
	graphqlEndpoint = "https://localhost:5001/graphql" // Updated to HTTPS and correct port
	apiKey          = "rabonaPod"                      // Hardcoded API key matching the server
	maxRetries      = 3                                // Number of retries for failed requests
)

type Score struct {
	HomeTeamScore int `json:"homeTeamScore"`
	AwayTeamScore int `json:"awayTeamScore"`
}

type Match struct {
	ID            string    `json:"id"`
	HomeTeamID    string    `json:"homeTeamId"`
	AwayTeamID    string    `json:"awayTeamId"`
	ScheduledDate time.Time `json:"scheduledDate"`
	Status        string    `json:"status"`
	Score         Score     `json:"score"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

func init() {
	if endpoint := os.Getenv("GRAPHQL_ENDPOINT"); endpoint != "" {
		graphqlEndpoint = endpoint
	}
}

func getGraphQLClient() *graphql.Client {
	httpClient := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true, // For development only
			},
		},
	}
	client := graphql.NewClient(graphqlEndpoint, graphql.WithHTTPClient(httpClient))
	return client
}

func readMatchesSQL() (string, error) {
	// Get the absolute path to the data directory
	dataPath := filepath.Join("/Users/wangen/Repos/Norskball/go-backend/data/matches.sql")
	content, err := os.ReadFile(dataPath)
	if err != nil {
		return "", fmt.Errorf("failed to read matches.sql: %v", err)
	}

	return string(content), nil
}

func parseMatches(sqlContent string) ([]Match, error) {
	// Remove the "insert into" part and get only the values
	valuesStart := strings.Index(strings.ToLower(sqlContent), "values")
	if valuesStart == -1 {
		return nil, fmt.Errorf("invalid SQL format: missing 'values' keyword")
	}

	// Extract the values portion
	valuesContent := sqlContent[valuesStart+6:]

	// Split into individual match entries
	entries := strings.Split(valuesContent, "),")

	var matches []Match
	for i, entry := range entries {
		// Clean up the entry
		entry = strings.TrimSpace(entry)
		if entry == "" {
			continue
		}

		// Remove leading '(' and trailing ');'
		entry = strings.TrimPrefix(entry, "(")
		if i == len(entries)-1 {
			entry = strings.TrimSuffix(entry, ");")
		}

		// Split the values
		values := strings.Split(entry, ", ")
		if len(values) < 29 { // We expect 29 fields for a match
			continue
		}

		// Parse the match data
		match := Match{
			ID:         strings.Trim(values[0], "'"),
			HomeTeamID: strings.Trim(values[1], "'"),
			AwayTeamID: strings.Trim(values[2], "'"),
			Status:     strings.Trim(values[8], "'"),
		}

		// Parse timestamps
		scheduledDate, _ := time.Parse("2006-01-02 15:04:05.000000", strings.Trim(values[7], "'"))
		createdAt, _ := time.Parse("2006-01-02 15:04:05.000000", strings.Trim(values[27], "'"))
		updatedAt, _ := time.Parse("2006-01-02 15:04:05.000000", strings.Trim(values[28], "'"))
		match.ScheduledDate = scheduledDate
		match.CreatedAt = createdAt
		match.UpdatedAt = updatedAt

		matches = append(matches, match)
	}

	return matches, nil
}

func parseInt(s string) int {
	var value int
	fmt.Sscanf(s, "%d", &value)
	return value
}

func addMatch(match Match) error {
	client := getGraphQLClient()

	mutation := `
	mutation AddMatch($match: MatchInput!) {
		addMatch(match: $match) {
			id
			homeTeamId
			awayTeamId
			scheduledDate
			status
			createdAt
			updatedAt
		}
	}`

	req := graphql.NewRequest(mutation)
	req.Var("match", match)
	req.Header.Set("X-API-Key", apiKey)

	var resp interface{}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	for attempt := 1; attempt <= maxRetries; attempt++ {
		err := client.Run(ctx, req, &resp)
		if err == nil {
			return nil
		}

		if attempt == maxRetries {
			return fmt.Errorf("failed to add match after %d attempts: %v", maxRetries, err)
		}

		// Wait before retrying with exponential backoff
		time.Sleep(time.Duration(attempt*attempt) * time.Second)
	}

	return nil
}

func main() {
	// Read the matches SQL file
	sqlContent, err := readMatchesSQL()
	if err != nil {
		fmt.Printf("Error reading matches SQL: %v\n", err)
		return
	}

	// Parse the matches
	matches, err := parseMatches(sqlContent)
	if err != nil {
		fmt.Printf("Error parsing matches: %v\n", err)
		return
	}

	fmt.Printf("Found %d matches to process\n", len(matches))

	// Add each match
	for i, match := range matches {
		err := addMatch(match)
		if err != nil {
			fmt.Printf("Error processing match %s: %v\n", match.ID, err)
			continue
		}
		fmt.Printf("Processed match %d/%d: %s\n", i+1, len(matches), match.ID)
	}

	fmt.Println("Match migration completed")
}
