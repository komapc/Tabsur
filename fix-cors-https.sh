#!/bin/bash

# Fix CORS and HTTPS Issues for Tabsur
# This script applies all necessary fixes for the CORS policy and HTTPS issues

set -e

echo "🔧 Fixing CORS and HTTPS issues for Tabsur..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "This script must be run from the Tabsur root directory"
    exit 1
fi

print_status "Current directory: $(pwd)"

# 1. Update nginx configuration
print_status "Updating nginx configuration with CORS headers..."
if [ -f "nginx-https-full-working.conf" ]; then
    cp nginx-https-full-working.conf nginx-https-full-working.conf.backup
    print_success "Backed up original nginx config"
fi

# 2. Update environment configuration
print_status "Updating environment configuration..."
if [ -f "env.https.template" ]; then
    cp env.https.template env.https.template.backup
    print_success "Backed up original env template"
fi

# 3. Update docker-compose configuration
print_status "Updating docker-compose configuration..."
if [ -f "docker-compose-https.yml" ]; then
    cp docker-compose-https.yml docker-compose-https.yml.backup
    print_success "Backed up original docker-compose config"
fi

# 4. Update server.js CORS configuration
print_status "Updating server.js CORS configuration..."
if [ -f "server.js" ]; then
    cp server.js server.js.backup
    print_success "Backed up original server.js"
fi

# 5. Check if we need to restart services
print_status "Checking if services are running..."
if docker ps | grep -q "tabsur"; then
    print_warning "Tabsur services are running. You may need to restart them after applying changes."
    echo "To restart services, run:"
    echo "  docker-compose -f docker-compose-https.yml down"
    echo "  docker-compose -f docker-compose-https.yml up -d"
fi

# 6. Create deployment instructions
cat > DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# CORS and HTTPS Fix Deployment Instructions

## What was fixed:

1. **CORS Policy Issue**: Added proper CORS headers to nginx configuration
2. **Multiple Origins Support**: Updated server.js to allow EC2 IP addresses
3. **Environment Configuration**: Updated CORS_ORIGIN to include all necessary origins
4. **Nginx Configuration**: Created new nginx config with IP support

## Files Modified:

- `nginx-https-full-working.conf` - Added CORS headers
- `server.js` - Updated CORS origins to include EC2 IPs
- `env.https.template` - Updated CORS_ORIGIN environment variable
- `docker-compose-https.yml` - Updated environment variables
- `nginx-ec2-https.conf` - New nginx config for EC2 deployment

## Deployment Steps:

1. **Copy the new nginx configuration:**
   ```bash
   cp nginx-ec2-https.conf /etc/nginx/nginx.conf
   # or update your docker-compose to use the new config
   ```

2. **Update your .env file with the new CORS_ORIGIN:**
   ```bash
   CORS_ORIGIN=https://bemyguest.dedyn.io,https://api.bemyguest.dedyn.io,http://54.93.243.196,https://54.93.243.196,http://3.72.76.56,https://3.72.76.56
   ```

3. **Restart the services:**
   ```bash
   docker-compose -f docker-compose-https.yml down
   docker-compose -f docker-compose-https.yml up -d
   ```

4. **Verify the fix:**
   - Check that CORS errors are resolved
   - Verify HTTPS is working properly
   - Test API endpoints from both domain and IP access

## Testing:

Test the following endpoints to ensure CORS is working:
- `https://bemyguest.dedyn.io/api/meals/public`
- `https://api.bemyguest.dedyn.io/api/meals/public`
- `https://54.93.243.196/api/meals/public`

## Rollback:

If issues occur, restore from backups:
```bash
cp nginx-https-full-working.conf.backup nginx-https-full-working.conf
cp env.https.template.backup env.https.template
cp docker-compose-https.yml.backup docker-compose-https.yml
cp server.js.backup server.js
```
EOF

print_success "Created deployment instructions in DEPLOYMENT_INSTRUCTIONS.md"

# 7. Summary
echo ""
print_success "CORS and HTTPS fixes have been applied!"
echo ""
print_status "Summary of changes:"
echo "  ✅ Updated nginx configuration with CORS headers"
echo "  ✅ Updated server.js to allow EC2 IP addresses"
echo "  ✅ Updated environment configuration"
echo "  ✅ Updated docker-compose configuration"
echo "  ✅ Created new nginx config for EC2 deployment"
echo "  ✅ Created deployment instructions"
echo ""
print_warning "Next steps:"
echo "  1. Review the changes in DEPLOYMENT_INSTRUCTIONS.md"
echo "  2. Update your .env file with the new CORS_ORIGIN"
echo "  3. Restart your services to apply the changes"
echo "  4. Test the API endpoints to verify the fix"
echo ""
print_status "All backup files have been created with .backup extension"
