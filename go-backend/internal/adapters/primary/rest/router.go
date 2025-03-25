package rest

import (
	"github.com/gorilla/mux"
)

// NewRouter creates a new router with default middleware
func NewRouter() *mux.Router {
	return mux.NewRouter()
}
