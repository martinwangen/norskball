package player

import (
	"context"
	"time"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/validation"
)

// Player represents a football player
type Player struct {
	ID            string    `json:"id"`
	FirstName     string    `json:"first_name"`
	LastName      string    `json:"last_name"`
	TeamID        string    `json:"team_id"`
	Nationality   string    `json:"nationality"`
	DateOfBirth   time.Time `json:"date_of_birth"`
	Position      string    `json:"position"`
	ImageURL      string    `json:"image_url"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}


// Validate validates the player entity
func (p *Player) Validate(ctx context.Context) validation.ValidationErrors {
	var errors validation.ValidationErrors

	// Validate required fields
	errors.AddIf(p.ID == "", "ID", "ID is required")
	errors.AddIf(p.FirstName == "", "FirstName", "First name is required")
	errors.AddIf(p.LastName == "", "LastName", "Last name is required")
	errors.AddIf(p.Nationality == "", "Nationality", "Nationality is required")
	errors.AddIf(p.Position == "", "Position", "Position is required")

	// Validate domain constraints
	errors.AddIf(p.DateOfBirth.After(time.Now()), "DateOfBirth", "Date of birth cannot be in the future")
	errors.AddIf(p.Age() > 50, "Age", "Player must be under 50 years old")

	return errors
}


// Age calculates the player's age based on their date of birth
func (p *Player) Age() int {
	if p.DateOfBirth.IsZero() {
		return 0
	}

	now := time.Now()
	age := now.Year() - p.DateOfBirth.Year()

	// Adjust age if birthday hasn't occurred yet this year
	if now.Month() < p.DateOfBirth.Month() || (now.Month() == p.DateOfBirth.Month() && now.Day() < p.DateOfBirth.Day()) {
		age--
	}

	return age
}
