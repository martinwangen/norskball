package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/primary/rest"
	services "github.com/martinwangen/norskball/apps/backend/internal/adapters/primary/services"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/database"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/repository"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/scraper"
	"github.com/martinwangen/norskball/apps/backend/internal/config"
)

func main() {
	// Load configuration
	cfg := config.GetConfig()

	// Initialize database connection
	db, err := database.NewPostgresDB(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize repositories
	playerRepo := repository.NewPostgresPlayerRepository(db)
	teamRepo := repository.NewPostgresTeamRepository(db)
	matchRepo := repository.NewPostgresMatchRepository(db)
	lineupRepo := repository.NewPostgresLineupRepository(db)

	// Initialize services
	playerService := services.NewPlayerService(playerRepo)
	teamService := services.NewTeamService(teamRepo)
	matchService := services.NewMatchService(matchRepo)
	lineupService := services.NewLineupService(lineupRepo)

	// Initialize scraper
	scraper := scraper.NewScraper(teamRepo, playerRepo)

	// Create context for scraper
	scraperCtx, scraperCancel := context.WithCancel(context.Background())
	defer scraperCancel()

	// Start periodic scraping
	scraper.StartPeriodicScraping(scraperCtx)

	// Initialize REST handlers
	playerHandler := rest.NewPlayerHandler(playerService)
	teamHandler := rest.NewTeamHandler(teamService)
	matchHandler := rest.NewMatchHandler(matchService)
	lineupHandler := rest.NewLineupHandler(lineupService)
	healthHandler := rest.NewHealthHandler()

	// Initialize router
	router := mux.NewRouter()

	// Apply standard middleware
	router.Use(rest.LoggingMiddleware(log.Default()))
	router.Use(rest.RecoveryMiddleware(log.Default()))
	router.Use(rest.ContentTypeMiddleware())

	// Register routes
	playerHandler.RegisterRoutes(router)
	teamHandler.RegisterRoutes(router)
	matchHandler.RegisterRoutes(router)
	lineupHandler.RegisterRoutes(router)
	healthHandler.RegisterRoutes(router)

	// Configure CORS
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:9000"}),
		handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"}),
		handlers.AllowedHeaders([]string{
			"Content-Type",
			"X-Requested-With",
			"Authorization",
			"Accept",
			"Origin",
		}),
		handlers.AllowCredentials(),
		handlers.MaxAge(3600),
	)

	// Create server with CORS handler
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Server.HTTPPort),
		Handler: corsHandler(router),
	}

	// Start server in a goroutine
	go func() {
		log.Printf("Starting server on port %d", cfg.Server.HTTPPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// Create a deadline to wait for
	ctx, cancel := context.WithTimeout(context.Background(), cfg.Server.Timeout)
	defer cancel()

	// Cancel scraper context
	scraperCancel()

	// Doesn't block if no connections, but will otherwise wait until the timeout deadline
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited properly")
}
