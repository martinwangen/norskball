.PHONY: build run test lint migrate clean

# Variables
BINARY_NAME=rabona-backend
GO_FILES=$(shell find . -name "*.go" -type f)

# Build the application
build:
	go build -o $(BINARY_NAME) cmd/main.go

# Run the application
run:
	go run cmd/main.go

# Run tests
test:
	go test -v ./...

# Run tests with coverage
test-coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out

# Run linter
lint:
	golangci-lint run

# Run database migrations
migrate:
	./scripts/migrate.sh

# Clean build artifacts
clean:
	rm -f $(BINARY_NAME)
	rm -f coverage.out

# Install dependencies
deps:
	go mod tidy
	go mod download

# Generate mocks for testing
mocks:
	mockgen -source=internal/core/ports/repositories.go -destination=internal/mocks/mock_repositories.go -package=mocks
	mockgen -source=internal/core/ports/services.go -destination=internal/mocks/mock_services.go -package=mocks

# Help command
help:
	@echo "Available commands:"
	@echo "  make build           - Build the application"
	@echo "  make run             - Run the application"
	@echo "  make test            - Run tests"
	@echo "  make test-coverage   - Run tests with coverage report"
	@echo "  make lint            - Run linter"
	@echo "  make migrate         - Run database migrations"
	@echo "  make clean           - Clean build artifacts"
	@echo "  make deps            - Install dependencies"
	@echo "  make mocks           - Generate mocks for testing"
	@echo "  make help            - Show this help message"

# Default target
default: help 