package common

import (
	"time"
)

// Referee represents a football match referee
type Referee struct {
	ID              string    `json:"id"`
	FirstName       string    `json:"first_name"`
	LastName        string    `json:"last_name"`
	Nationality     string    `json:"nationality"`
	DateOfBirth     time.Time `json:"date_of_birth"`
	YearsExperience int       `json:"years_experience"`
	Image           string    `json:"image"` // Image URL
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// NewReferee creates a new referee instance
func NewReferee(first_name, last_name, nationality string, dateOfBirth time.Time) *Referee {
	now := time.Now()
	return &Referee{
		ID:          generateRefereeID(),
		FirstName:   first_name,
		LastName:    last_name,
		Nationality: nationality,
		DateOfBirth: dateOfBirth,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

// FullName returns the referee's full name
func (r *Referee) FullName() string {
	return r.FirstName + " " + r.LastName
}

// UpdateName updates the referee's name
func (r *Referee) UpdateName(first_name, last_name string) {
	r.FirstName = first_name
	r.LastName = last_name
	r.UpdatedAt = time.Now()
}

// UpdateNationality updates the referee's nationality
func (r *Referee) UpdateNationality(nationality string) {
	r.Nationality = nationality
	r.UpdatedAt = time.Now()
}

// UpdateDateOfBirth updates the referee's date of birth
func (r *Referee) UpdateDateOfBirth(dateOfBirth time.Time) {
	r.DateOfBirth = dateOfBirth
	r.UpdatedAt = time.Now()
}

// UpdateExperience updates the referee's years of experience
func (r *Referee) UpdateExperience(years int) {
	r.YearsExperience = years
	r.UpdatedAt = time.Now()
}

// UpdateImage updates the referee's image URL
func (r *Referee) UpdateImage(imageURL string) {
	r.Image = imageURL
	r.UpdatedAt = time.Now()
}

// Age calculates the referee's age based on their date of birth
func (r *Referee) Age() int {
	if r.DateOfBirth.IsZero() {
		return 0
	}

	now := time.Now()
	age := now.Year() - r.DateOfBirth.Year()

	// Adjust age if birthday hasn't occurred yet this year
	if now.Month() < r.DateOfBirth.Month() || (now.Month() == r.DateOfBirth.Month() && now.Day() < r.DateOfBirth.Day()) {
		age--
	}

	return age
}

// generateRefereeID generates a unique ID for a referee
// Note: Implement this according to your ID generation strategy
func generateRefereeID() string {
	// Implementation depends on your ID generation strategy
	// Could use UUID, sequential IDs, etc.
	return "referee_" + time.Now().Format("20060102150405")
}
