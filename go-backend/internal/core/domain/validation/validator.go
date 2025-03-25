package validation

import (
	"context"
	"errors"
	"fmt"
	"reflect"
	"strings"
)

// ValidationError represents an error that occurred during validation
type ValidationError struct {
	Field   string
	Message string
}

// Error returns the validation error as a string
func (e ValidationError) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

// ValidationErrors represents a collection of validation errors
type ValidationErrors []ValidationError

// Error returns all validation errors as a single string
func (e ValidationErrors) Error() string {
	if len(e) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("Validation errors:\n")
	for _, err := range e {
		sb.WriteString("  - ")
		sb.WriteString(err.Error())
		sb.WriteString("\n")
	}
	return sb.String()
}

// HasErrors returns true if there are any validation errors
func (e ValidationErrors) HasErrors() bool {
	return len(e) > 0
}

// Add adds a validation error to the collection
func (e *ValidationErrors) Add(field, message string) {
	*e = append(*e, ValidationError{Field: field, Message: message})
}

// AddIf adds a validation error if the condition is true
func (e *ValidationErrors) AddIf(condition bool, field, message string) {
	if condition {
		e.Add(field, message)
	}
}

// Validator defines an interface for validating domain entities
type Validator interface {
	// Validate performs validation and returns validation errors
	Validate(ctx context.Context) ValidationErrors
}

// IsValid checks if an entity is valid by calling its Validate method
func IsValid(ctx context.Context, entity interface{}) error {
	if validator, ok := entity.(Validator); ok {
		errors := validator.Validate(ctx)
		if errors.HasErrors() {
			return errors
		}
		return nil
	}

	// If the entity doesn't implement Validator, we consider it valid
	return nil
}

// IsValidSlice validates all entities in a slice
func IsValidSlice(ctx context.Context, entities interface{}) error {
	val := reflect.ValueOf(entities)
	if val.Kind() != reflect.Slice {
		return errors.New("not a slice")
	}

	for i := 0; i < val.Len(); i++ {
		item := val.Index(i).Interface()
		if err := IsValid(ctx, item); err != nil {
			return fmt.Errorf("invalid item at index %d: %w", i, err)
		}
	}

	return nil
}
