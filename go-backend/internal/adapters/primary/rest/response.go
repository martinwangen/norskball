package rest

import (
	"encoding/json"
	"net/http"
)

// Response represents a standard API response
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorInfo  `json:"error,omitempty"`
	Meta    *MetaInfo   `json:"meta,omitempty"`
}

// ErrorInfo represents error information
type ErrorInfo struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// MetaInfo represents metadata information
type MetaInfo struct {
	Page       int    `json:"page,omitempty"`
	PerPage    int    `json:"per_page,omitempty"`
	TotalItems int    `json:"total_items,omitempty"`
	TotalPages int    `json:"total_pages,omitempty"`
	NextToken  string `json:"next_token,omitempty"`
}

// NewSuccessResponse creates a new success response
func NewSuccessResponse(data interface{}) *Response {
	return &Response{
		Success: true,
		Data:    data,
	}
}

// NewErrorResponse creates a new error response
func NewErrorResponse(code, message string) *Response {
	return &Response{
		Success: false,
		Error: &ErrorInfo{
			Code:    code,
			Message: message,
		},
	}
}

// NewPaginatedResponse creates a new paginated response
func NewPaginatedResponse(data interface{}, page, perPage, totalItems int, nextToken string) *Response {
	totalPages := 0
	if perPage > 0 {
		totalPages = (totalItems + perPage - 1) / perPage
	}

	return &Response{
		Success: true,
		Data:    data,
		Meta: &MetaInfo{
			Page:       page,
			PerPage:    perPage,
			TotalItems: totalItems,
			TotalPages: totalPages,
			NextToken:  nextToken,
		},
	}
}

// RespondWithJSON sends a JSON response
func RespondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"success":false,"error":{"code":"internal_error","message":"Failed to marshal response"}}`))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(response)
}

// RespondWithError sends an error response
func RespondWithError(w http.ResponseWriter, statusCode int, code, message string) {
	RespondWithJSON(w, statusCode, NewErrorResponse(code, message))
}

// Common error codes
const (
	ErrCodeNotFound        = "not_found"
	ErrCodeBadRequest      = "bad_request"
	ErrCodeInternalError   = "internal_error"
	ErrCodeUnauthorized    = "unauthorized"
	ErrCodeForbidden       = "forbidden"
	ErrCodeConflict        = "conflict"
	ErrCodeValidationError = "validation_error"
)
