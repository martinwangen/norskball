package rest

import (
	"log"
	"net/http"
	"runtime/debug"
	"time"

	"github.com/gorilla/mux"
)

// LoggingMiddleware logs HTTP requests
func LoggingMiddleware(logger *log.Logger) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			next.ServeHTTP(w, r)
			logger.Printf("%s %s %s", r.Method, r.RequestURI, time.Since(start))
		})
	}
}

// RecoveryMiddleware recovers from panics
func RecoveryMiddleware(logger *log.Logger) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil {
					logger.Printf("Panic: %v\n%s", err, debug.Stack())
					RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, "An unexpected error occurred")
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}

// ContentTypeMiddleware sets the content type to JSON
func ContentTypeMiddleware() mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			next.ServeHTTP(w, r)
		})
	}
}
