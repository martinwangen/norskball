#!/bin/bash

# Kill any process using port 9000
echo "Checking for processes using port 9000..."
if lsof -i:9000 > /dev/null 2>&1; then
  echo "Killing process using port 9000..."
  kill -9 $(lsof -t -i:9000) 2>/dev/null || true
  sleep 1  # Give the process time to terminate
fi

# Start the frontend application
echo "Starting Rabona Ratings frontend..."
npm run dev 