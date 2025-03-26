# Norskball Hosting Guide

## Infrastructure Overview
- **Platform**: Google Cloud Platform (GCP)
- **Region**: europe-north1-a
- **Machine Type**: e2-micro (2 shared vCPU, 1GB RAM)
- **Cost Estimate**: ~$6-8/month

## Components
- **Database**: MSSQL Express (Docker container)
- **Backend**: .NET Core API (Docker container)
- **Frontend**: Quasar/Vue.js (Docker container)
- **Reverse Proxy**: Nginx (Docker container)

## Setup Instructions

### 1. GCP Setup
```bash
# Login to GCP
gcloud auth login

# Set project
gcloud config set project norskball

# Create service account for GitHub Actions
gcloud iam service-accounts create github-actions \
  --description="Service account for GitHub Actions" \
  --display-name="GitHub Actions"

# Grant permissions
gcloud projects add-iam-policy-binding norskball \
  --member="serviceAccount:github-actions@norskball.iam.gserviceaccount.com" \
  --role="roles/compute.admin"

# Create service account key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@norskball.iam.gserviceaccount.com
```

### 2. VM Instance
```bash
# Create VM
gcloud compute instances create norskball-vm \
  --zone=europe-north1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server
```

### 3. GitHub Repository Setup
Add these secrets to your GitHub repository:
- `GCP_SA_KEY`: Content of key.json (service account key)
- `GCP_ZONE`: europe-north1-a
- `GCP_INSTANCE_NAME`: norskball-vm
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token

### 4. Docker Hub Setup
Create these repositories:
- norskball-frontend
- norskball-backend

### 5. Domain Setup
Update these DNS records:
- norskball.duckdns.org → VM IP (34.88.192.162)
- norskball.no → VM IP (34.88.192.162)
- www.norskball.no → VM IP (34.88.192.162)

## Deployment
The application is automatically deployed via GitHub Actions when pushing to the main branch.

### Manual Deployment
If needed, you can manually deploy:
```bash
# Connect to VM
gcloud compute ssh norskball-vm --zone=europe-north1-a

# Deploy
cd ~/Norskball
export DOCKERHUB_USERNAME=sulfax
docker compose pull
docker compose up -d
```

## Monitoring
```bash
# Check container status
docker compose ps

# View logs
docker compose logs

# View specific service logs
docker compose logs backend
docker compose logs frontend
docker compose logs nginx
```

## Common Tasks

### Restart Services
```bash
docker compose restart
```

### Update Images
```bash
docker compose pull
docker compose up -d
```

### Check Database
```bash
docker compose exec mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd
```

## Troubleshooting

### Check Service Status
```bash
# View all containers
docker ps -a

# Check logs
docker compose logs --tail=100 -f
```

### Common Issues
1. **Database Connection**: Check if MSSQL container is running and accessible
2. **Frontend 502**: Verify nginx configuration and frontend container status
3. **Backend API**: Check backend container logs for any startup errors

## Backup
Currently using Docker volumes for MSSQL data persistence. Consider implementing regular backups if needed.

## Security Notes
- MSSQL Express is running in Docker with a default password
- HTTP/HTTPS ports (80/443) are open
- Using Docker Hub for container registry
- GCP firewall rules are configured for HTTP/HTTPS traffic

## Cost Management
- Using e2-micro instance for cost optimization
- MSSQL Express edition (free)
- Docker Hub free tier
- Estimated monthly cost: ~$6-8 