package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"

	"github.com/martinwangen/norskball/apps/backend/internal/adapters/primary/rest"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/repository"
	"github.com/martinwangen/norskball/apps/backend/internal/config"
	"github.com/martinwangen/norskball/apps/backend/internal/core/service"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig("appsettings.json")
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize database connection
	db, err := sql.Open("postgres", cfg.Database.ConnectionString())
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Test database connection
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	// Initialize repositories
	playerRepo := repository.NewPlayerRepository(db)
	teamRepo := repository.NewTeamRepository(db)
	matchRepo := repository.NewMatchRepository(db)

	// Initialize core services
	playerService := service.NewPlayerService(playerRepo)
	teamService := service.NewTeamService(teamRepo)
	matchService := service.NewMatchService(matchRepo)

	// Initialize REST handlers
	playerHandler := rest.NewPlayerHandler(playerService)
	teamHandler := rest.NewTeamHandler(teamService)
	matchHandler := rest.NewMatchHandler(matchService)

	// Initialize REST router
	router := mux.NewRouter()
	router.Use(rest.CORSMiddleware())

	// Register REST routes
	playerHandler.RegisterRoutes(router)
	teamHandler.RegisterRoutes(router)
	matchHandler.RegisterRoutes(router)

	// Create server
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Server.Port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("Starting HTTP server on port %d", cfg.Server.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start HTTP server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	// Graceful shutdown
	log.Println("Server is shutting down...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited properly")
}
