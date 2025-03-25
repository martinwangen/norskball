# Backend Service

This is the backend service for the Norskball application, built with Go and PostgreSQL.

## Technology Stack

- **Language**: Go 1.21+
- **Framework**: Custom REST API using Gorilla Mux
- **Database**: PostgreSQL
- **Container**: Docker
- **Dependencies Management**: Go Modules

## Project Structure

```
.
├── cmd/            # Command-line tools and entry points
├── data/           # Data files and migrations
├── internal/       # Private application code
│   ├── adapters/   # External adapters (REST, repositories)
│   └── core/       # Core business logic
├── scripts/        # Utility scripts
├── main.go         # Application entry point
├── Dockerfile      # Container definition
└── docker-compose.yml
```

## Prerequisites

- Go 1.21 or later
- Docker and Docker Compose
- PostgreSQL
- Make (for using Makefile commands)

## Getting Started

1. Clone the repository
2. Navigate to the backend directory
3. Copy and configure your environment:
   ```bash
   cp appsettings.json.example appsettings.json
   # Edit appsettings.json with your configuration
   ```

### Running with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d
```

### Running Locally

1. Start PostgreSQL:
   ```bash
   docker-compose up -d postgres
   ```

2. Run the application:
   ```bash
   go run main.go
   ```

## API Endpoints

The service exposes the following REST endpoints:

### Players
- `GET /api/players` - List all players
- `GET /api/players/{id}` - Get player by ID
- `POST /api/players` - Create new player
- `PUT /api/players/{id}` - Update player
- `DELETE /api/players/{id}` - Delete player

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/{id}` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team

### Matches
- `GET /api/matches` - List all matches
- `GET /api/matches/{id}` - Get match by ID
- `POST /api/matches` - Create new match
- `PUT /api/matches/{id}` - Update match
- `DELETE /api/matches/{id}` - Delete match

## Development

### Database Migrations

Database migrations are managed using Goose. To run migrations:

```bash
make migrate-up    # Apply migrations
make migrate-down  # Rollback migrations
```

### Testing

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...
```

## Configuration

The application is configured through `appsettings.json`. Key configuration options include:

- Database connection details
- Server port and host
- CORS settings
- Logging configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
