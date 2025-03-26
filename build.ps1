# Build and push backend
Write-Host "Building backend..."
docker build -t sulfax/norskball-backend:latest ./backend
docker push sulfax/norskball-backend:latest

# Build and push frontend
Write-Host "Building frontend..."
docker build -t sulfax/norskball-frontend:latest ./frontend
docker push sulfax/norskball-frontend:latest

Write-Host "Build complete!" 