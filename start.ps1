# Create necessary directories if they don't exist
New-Item -ItemType Directory -Force -Path "nginx/ssl"
New-Item -ItemType Directory -Force -Path "nginx/conf.d"

# Pull the latest images
Write-Host "Pulling latest images from DockerHub..."
docker-compose pull

# Start the application
Write-Host "Starting Norskball application..."
docker-compose up -d

Write-Host "Application is starting up..."
Write-Host "You can check the status with: docker-compose ps"
Write-Host "View logs with: docker-compose logs -f" 