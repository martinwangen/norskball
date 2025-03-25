# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# Final stage
FROM alpine:3.18

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .

# Copy any additional required files (if needed)
# COPY config/ config/

# Install necessary packages
RUN apk --no-cache add ca-certificates tzdata postgresql-client

# Copy migration scripts
COPY --from=builder /app/scripts/migrations /app/scripts/migrations
COPY --from=builder /app/scripts/migrate.sh /app/scripts/migrate.sh

# Make scripts executable
RUN chmod +x /app/scripts/migrate.sh

# Expose port
EXPOSE 8080

# Command to run the application
CMD ["./main"] 