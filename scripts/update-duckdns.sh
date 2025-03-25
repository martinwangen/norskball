#!/bin/bash

# Replace these with your actual values
DUCKDNS_TOKEN="77144d60-3e66-48ee-a020-9fdefb591a7d"
DOMAIN="norskball.duckdns.org"
CUSTOM_DOMAIN="norskball.no"

# Get current IP
CURRENT_IP=$(curl -s https://api.ipify.org)

# Update DuckDNS
echo "Updating DuckDNS for $DOMAIN with IP: $CURRENT_IP"
curl "https://www.duckdns.org/update?domains=$DOMAIN&token=$DUCKDNS_TOKEN&ip=$CURRENT_IP"

# Update custom domain A record
# Note: You'll need to replace this with your actual domain registrar's API call
# This is just a placeholder - you'll need to implement the actual API call
# based on your domain registrar's API documentation
echo "Updating A record for $CUSTOM_DOMAIN with IP: $CURRENT_IP"
# Example for some registrars:
# curl -X POST "https://api.your-registrar.com/v1/dns/update" \
#   -H "Authorization: Bearer YOUR_API_TOKEN" \
#   -H "Content-Type: application/json" \
#   -d "{\"domain\":\"$CUSTOM_DOMAIN\",\"type\":\"A\",\"value\":\"$CURRENT_IP\"}" 