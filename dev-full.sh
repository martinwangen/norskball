#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Norskball Development Environment ===${NC}"
echo -e "${YELLOW}This script will start both the frontend and backend applications.${NC}"
echo -e "${YELLOW}Press Ctrl+C to terminate all processes.${NC}"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if dotnet is installed
if ! command_exists dotnet; then
  echo -e "${RED}Error: dotnet is not installed. Please install .NET SDK.${NC}"
  exit 1
fi

# Check if yarn is installed
if ! command_exists yarn; then
  echo -e "${RED}Error: yarn is not installed. Please install yarn.${NC}"
  exit 1
fi

# Create a trap to kill all background processes when the script exits
trap 'echo -e "${YELLOW}Shutting down all processes...${NC}"; kill $(jobs -p) 2>/dev/null' EXIT

# Check if backend project exists
if [ ! -d "backend" ]; then
  echo -e "${RED}Error: Backend project directory not found.${NC}"
  exit 1
fi

# Check if frontend project exists
if [ ! -d "frontend" ]; then
  echo -e "${RED}Error: Frontend project directory not found.${NC}"
  exit 1
fi

# Kill any existing processes using port 5001
echo -e "${YELLOW}Checking for processes using port 5001...${NC}"
if command_exists lsof; then
  PORT_PID=$(lsof -ti:5001)
  if [ -n "$PORT_PID" ]; then
    echo -e "${YELLOW}Killing process $PORT_PID using port 5001...${NC}"
    kill -9 $PORT_PID 2>/dev/null
    sleep 1
  else
    echo -e "${GREEN}No processes found using port 5001.${NC}"
  fi
else
  echo -e "${YELLOW}lsof not found, skipping port check.${NC}"
fi

# Copy the schema.graphql file to the frontend directory
echo -e "${GREEN}Copying GraphQL schema to frontend...${NC}"
if [ -f "schema.graphql" ]; then
  cp schema.graphql frontend/
  echo -e "${GREEN}Schema copied successfully.${NC}"
else
  echo -e "${YELLOW}Warning: schema.graphql not found in root directory.${NC}"
  echo -e "${YELLOW}The backend will need to generate it first.${NC}"
fi

# Start the backend
echo -e "${GREEN}Starting backend...${NC}"
(cd backend/src/Norskball && dotnet run) &
BACKEND_PID=$!

# Wait for the backend to start and generate the schema
echo -e "${YELLOW}Waiting for backend to start and generate schema...${NC}"
sleep 10
echo -e "${GREEN}Backend should be running now.${NC}"

# Check if schema.graphql was generated
if [ -f "schema.graphql" ] && [ ! -f "frontend/schema.graphql" ]; then
  echo -e "${GREEN}Copying newly generated GraphQL schema to frontend...${NC}"
  cp schema.graphql frontend/
fi

# Run GraphQL codegen
echo -e "${GREEN}Running GraphQL codegen...${NC}"
(cd frontend && yarn graphql-codegen --verbose)
if [ $? -ne 0 ]; then
  echo -e "${RED}ERROR: GraphQL codegen failed. Please fix the errors before continuing.${NC}"
  exit 1
fi
echo -e "${GREEN}GraphQL codegen completed successfully.${NC}"

# Start the frontend with GraphQL codegen watch
echo -e "${GREEN}Starting frontend and GraphQL codegen watch...${NC}"
(cd frontend && yarn dev) &
FRONTEND_PID=$!

(cd frontend && yarn graphql-codegen --watch) &
CODEGEN_PID=$!

echo -e "${BLUE}=== Development Environment Started ===${NC}"
echo -e "${GREEN}Backend:${NC} https://localhost:5001"
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}GraphQL Playground:${NC} https://localhost:5001/graphql"
echo -e "${GREEN}Health Checks:${NC} https://localhost:5001/health"
echo -e "${YELLOW}Press Ctrl+C to terminate all processes.${NC}"

# Wait for all processes to finish
wait $BACKEND_PID $FRONTEND_PID $CODEGEN_PID
