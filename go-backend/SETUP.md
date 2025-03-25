# Rabona Backend Setup

This document provides a summary of the setup process for the Rabona backend service.

## What We've Done

1. **Created the Database Schema**
   - Defined tables for teams, players, and matches
   - Added indexes for efficient querying
   - Created triggers for automatic timestamp updates

2. **Set Up the Development Environment**
   - Created a Docker Compose configuration with PostgreSQL and PgAdmin
   - Added a migrations service for database setup
   - Created a Dockerfile for the backend service

3. **Implemented Core Infrastructure**
   - Set up configuration management with environment variables
   - Created a database connection package
   - Implemented middleware for logging, error handling, and CORS
   - Added a health check endpoint

4. **Created Development Scripts**
   - Added a script for running database migrations
   - Created a script for starting the development environment
   - Set up a Makefile for common development tasks

## Getting Started

### Prerequisites

- Go 1.21 or higher
- Docker and Docker Compose
- PostgreSQL client tools (for local development)

### Starting the Development Environment

1. Start the database and run migrations:
   ```bash
   ./scripts/start-dev.sh
   ```

   This script will:
   - Start PostgreSQL and PgAdmin containers
   - Wait for PostgreSQL to be ready
   - Run database migrations
   - Start the backend service

2. Alternatively, you can use Docker Compose to start all services:
   ```bash
   docker-compose up -d
   ```

3. Access the services:
   - Backend API: http://localhost:8080
   - PgAdmin: http://localhost:5050 (admin@rabona.com / admin)

### Development Workflow

1. Make changes to the code
2. Run tests:
   ```bash
   make test
   ```

3. Run linter:
   ```bash
   make lint
   ```

4. Build the application:
   ```bash
   make build
   ```

## Next Steps

1. **Implement Repository Layer**
   - Create repository implementations for teams, players, and matches
   - Add unit tests for repositories

2. **Implement Service Layer**
   - Create service implementations for teams, players, and matches
   - Add unit tests for services

3. **Implement REST Handlers**
   - Create handlers for teams, players, and matches
   - Add integration tests for handlers 