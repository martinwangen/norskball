Write-Host "Checking DockerHub images..."

# Check if logged in
$loginStatus = docker info | Select-String "Username"
if (-not $loginStatus) {
    Write-Host "Not logged into DockerHub. Please run 'docker login' first."
    exit 1
}

# Check image availability
Write-Host "Checking backend image..."
$backendExists = docker manifest inspect sulfax/norskball-backend:latest 2>$null
if ($backendExists) {
    Write-Host "✓ Backend image exists"
} else {
    Write-Host "✗ Backend image not found"
}

Write-Host "Checking frontend image..."
$frontendExists = docker manifest inspect sulfax/norskball-frontend:latest 2>$null
if ($frontendExists) {
    Write-Host "✓ Frontend image exists"
} else {
    Write-Host "✗ Frontend image not found"
} 