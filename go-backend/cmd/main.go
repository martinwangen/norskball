package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"

	"github.com/wangen/rabona/apps/backend/internal/adapters/primary/rest"
	"github.com/wangen/rabona/apps/backend/internal/adapters/secondary/database"
	"github.com/wangen/rabona/apps/backend/internal/config"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Set up logger
	logger := log.New(os.Stdout, "[RABONA] ", log.LstdFlags)
	logger.Printf("Starting Rabona backend service...")

	// Connect to database
	db, err := database.NewPostgresDB(&cfg.Database)
	if err != nil {
		logger.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	logger.Printf("Connected to database")

	// Create repositories
	// TODO: Initialize repositories

	// Create services
	// TODO: Initialize services

	// Set up REST server
	router := mux.NewRouter()

	// Apply middleware
	router.Use(rest.LoggingMiddleware(logger))
	router.Use(rest.RecoveryMiddleware(logger))
	router.Use(rest.CORSMiddleware())
	router.Use(rest.ContentTypeMiddleware())

	// Register REST handlers
	apiRouter := router.PathPrefix("/api/v1").Subrouter()

	// Register health check handler
	healthHandler := rest.NewHealthHandler()
	healthHandler.RegisterRoutes(router)

	// Register API-specific health check
	apiRouter.HandleFunc("/health", healthHandler.HealthCheck).Methods(http.MethodGet)

	// TODO: Register other handlers

	// Set up HTTP server
	httpServer := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Server.HTTPPort),
		Handler:      router,
		ReadTimeout:  cfg.Server.Timeout,
		WriteTimeout: cfg.Server.Timeout,
		IdleTimeout:  120 * time.Second,
	}

	// Start HTTP server
	go func() {
		logger.Printf("Starting HTTP server on port %d", cfg.Server.HTTPPort)
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatalf("Failed to start HTTP server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Printf("Shutting down server...")

	// Gracefully shut down server
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := httpServer.Shutdown(ctx); err != nil {
		logger.Fatalf("Server forced to shutdown: %v", err)
	}

	logger.Printf("Server stopped")
}
