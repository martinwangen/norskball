#!/bin/bash

# Kill any process using port 8080
echo "Checking for processes using port 8080..."
if lsof -i:8080 > /dev/null 2>&1; then
  echo "Killing process using port 8080..."
  kill -9 $(lsof -t -i:8080) 2>/dev/null || true
  sleep 1  # Give the process time to terminate
fi

# Start the backend API server
echo "Starting Rabona Ratings API server..."
go run cmd/api/main.go 