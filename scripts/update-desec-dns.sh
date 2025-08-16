#!/bin/bash

# deSEC DNS Update Script
# This script updates DNS records for bemyguest.dedyn.io

# Configuration
DOMAIN="bemyguest.dedyn.io"
API_SERVER_DOMAIN="api.bemyguest.dedyn.io"
AUTH_TOKEN="yNoJQUBJAsodeSJ2pJRAZyM5fTSv"
DESEC_API="https://desec.io/api/v1/domains/${DOMAIN}/rrsets/"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 deSEC DNS Update Script${NC}"
echo -e "${YELLOW}Domain: ${DOMAIN}${NC}"
echo -e "${YELLOW}API Server: ${API_SERVER_DOMAIN}${NC}"
echo ""

# Function to update DNS record
update_dns_record() {
    local record_type=$1
    local name=$2
    local value=$3
    
    echo -e "${YELLOW}Updating ${record_type} record for ${name}...${NC}"
    
    # Create the JSON payload - fix the format for deSEC API
    local json_payload
    if [[ "$record_type" == "CNAME" ]]; then
        json_payload="{\"subname\":\"${name}\",\"type\":\"${record_type}\",\"records\":[\"${value}\"],\"ttl\":300}"
    else
        json_payload="{\"subname\":\"${name}\",\"type\":\"${record_type}\",\"records\":[\"${value}\"],\"ttl\":300}"
    fi
    
    # Make the API request
    local response=$(curl -s -X PATCH \
        -H "Authorization: Token ${AUTH_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "$json_payload" \
        "${DESEC_API}")
    
    # Check for rate limiting
    if echo "$response" | grep -q "throttled"; then
        echo -e "${YELLOW}⚠️  Rate limited, waiting 2 seconds...${NC}"
        sleep 2
        # Retry the request
        response=$(curl -s -X PATCH \
            -H "Authorization: Token ${AUTH_TOKEN}" \
            -H "Content-Type: application/json" \
            -d "$json_payload" \
            "${DESEC_API}")
    fi
    
    if [[ $? -eq 0 ]]; then
        if echo "$response" | grep -q "error\|Error"; then
            echo -e "${RED}❌ API error: $response${NC}"
        else
            echo -e "${GREEN}✅ Successfully updated ${record_type} record for ${name}${NC}"
        fi
    else
        echo -e "${RED}❌ Failed to update ${record_type} record for ${name}${NC}"
    fi
    
    echo ""
}

# Function to get current public IP
get_public_ip() {
    echo -e "${YELLOW}🌐 Getting current public IP...${NC}"
    
    # Try multiple IP services for redundancy
    local ip1=$(curl -s --max-time 5 https://ipinfo.io/ip 2>/dev/null)
    local ip2=$(curl -s --max-time 5 https://ifconfig.me 2>/dev/null)
    local ip3=$(curl -s --max-time 5 https://icanhazip.com 2>/dev/null)
    
    # Use the first successful response
    if [[ -n "$ip1" ]]; then
        echo -e "${GREEN}Current public IP: ${ip1}${NC}"
        echo "$ip1"
    elif [[ -n "$ip2" ]]; then
        echo -e "${GREEN}Current public IP: ${ip2}${NC}"
        echo "$ip2"
    elif [[ -n "$ip3" ]]; then
        echo -e "${GREEN}Current public IP: ${ip3}${NC}"
        echo "$ip3"
    else
        echo -e "${RED}❌ Failed to get public IP${NC}"
        exit 1
    fi
}

# Main execution
main() {
    local current_ip=$(get_public_ip)
    
    if [[ -z "$current_ip" ]]; then
        echo -e "${RED}❌ Could not determine public IP. Exiting.${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}🚀 Starting DNS updates...${NC}"
    echo ""
    
    # Update A records
    update_dns_record "A" "" "$current_ip"                    # Root domain
    update_dns_record "A" "api" "$current_ip"                 # API subdomain
    
    # Update CNAME records for www
    update_dns_record "CNAME" "www" "$DOMAIN."
    
    # Update TXT record for verification
    update_dns_record "TXT" "" "Tabsur App - Updated $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    
    echo -e "${GREEN}🎉 DNS update completed!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Summary:${NC}"
    echo -e "  • Root domain (${DOMAIN}) → ${current_ip}"
    echo -e "  • API server (${API_SERVER_DOMAIN}) → ${current_ip}"
    echo -e "  • www subdomain → ${DOMAIN}"
    echo ""
    echo -e "${YELLOW}⏳ DNS propagation may take a few minutes...${NC}"
}

# Run the script
main "$@"
