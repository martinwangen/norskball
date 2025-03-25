# Replace these with your actual values
$DUCKDNS_TOKEN = "77144d60-3e66-48ee-a020-9fdefb591a7d"
$DOMAIN = "norskball.duckdns.org"
$CUSTOM_DOMAIN = "norskball.no"

# Get current IP
$CURRENT_IP = Invoke-RestMethod -Uri "https://api.ipify.org"

# Update DuckDNS
Write-Host "Updating DuckDNS for $DOMAIN with IP: $CURRENT_IP"
Invoke-RestMethod -Uri "https://www.duckdns.org/update?domains=$DOMAIN&token=$DUCKDNS_TOKEN&ip=$CURRENT_IP"

# Update custom domain A record
Write-Host "Updating A record for $CUSTOM_DOMAIN with IP: $CURRENT_IP"
# Note: You'll need to replace this with your actual domain registrar's API call
# This is just a placeholder - you'll need to implement the actual API call
# based on your domain registrar's API documentation 