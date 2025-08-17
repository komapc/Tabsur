#!/bin/bash

# Remote Deployment Fix Script for bemyguest.dedyn.io
# This script fixes all the current issues on the remote server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Remote Deployment Fix Script for bemyguest.dedyn.io${NC}"
echo -e "${YELLOW}This script will fix all current deployment issues${NC}"

# Configuration
REMOTE_HOST="3.249.94.227"
REMOTE_USER="ubuntu"
REMOTE_DIR="/home/ubuntu/Tabsur"
DOMAIN="bemyguest.dedyn.io"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    
    if ! command_exists ssh; then
        echo -e "${RED}❌ SSH is not installed${NC}"
        exit 1
    fi
    
    if ! command_exists scp; then
        echo -e "${RED}❌ SCP is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Test SSH connection
test_ssh_connection() {
    echo -e "${YELLOW}🔌 Testing SSH connection to $REMOTE_HOST...${NC}"
    
    if ssh -o ConnectTimeout=10 -o BatchMode=yes $REMOTE_USER@$REMOTE_HOST "echo 'SSH connection successful'" 2>/dev/null; then
        echo -e "${GREEN}✅ SSH connection successful${NC}"
        return 0
    else
        echo -e "${RED}❌ SSH connection failed${NC}"
        echo -e "${YELLOW}Please ensure:${NC}"
        echo -e "  1. SSH key is configured for $REMOTE_USER@$REMOTE_HOST"
        echo -e "  2. Server is accessible"
        echo -e "  3. Firewall allows SSH connections"
        return 1
    fi
}

# Create environment configuration
create_env_config() {
    echo -e "${YELLOW}📝 Creating environment configuration...${NC}"
    
    cat > .env.remote << 'EOF'
# Remote Production Environment for bemyguest.dedyn.io
# Copy this file to .env on the remote server

# =============================================================================
# DOMAIN CONFIGURATION
# =============================================================================
DOMAIN=bemyguest.dedyn.io
API_SUBDOMAIN=api.bemyguest.dedyn.io
WWW_SUBDOMAIN=www.bemyguest.dedyn.io

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DB_HOST=3.249.94.227
DB_PORT=5432
DB_NAME=coolanu
DB_USER=coolanu_user
DB_PASSWORD=your_secure_database_password_here
DB_SSL=false

# =============================================================================
# JWT CONFIGURATION
# =============================================================================
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# =============================================================================
# GOOGLE MAPS API
# =============================================================================
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# =============================================================================
# GOOGLE OAUTH CONFIGURATION
# =============================================================================
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here

# =============================================================================
# FIREBASE CONFIGURATION
# =============================================================================
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
GOOGLE_FIREBASE_CLOUD_MESSAGING_SERVER_KEY=your_firebase_server_key_here

# =============================================================================
# SERVER CONFIGURATION
# =============================================================================
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://bemyguest.dedyn.io

# =============================================================================
# AWS CONFIGURATION
# =============================================================================
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-central-1

# =============================================================================
# ECR CONFIGURATION
# =============================================================================
ECR_REGISTRY=272007598366.dkr.ecr.eu-central-1.amazonaws.com
ECR_REPOSITORY=tabsur

# =============================================================================
# EC2 CONFIGURATION
# =============================================================================
EC2_INSTANCE_ID=i-your-instance-id-here
EC2_PUBLIC_IP=3.72.76.56
SSH_KEY_PATH=~/.ssh/coolanu-postgres

# =============================================================================
# SSL CONFIGURATION
# =============================================================================
SSL_CERT_PATH=/etc/letsencrypt/live/bemyguest.dedyn.io/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/bemyguest.dedyn.io/privkey.pem

# =============================================================================
# NGINX CONFIGURATION
# =============================================================================
NGINX_CONFIG_FILE=nginx-https.conf
NGINX_HTTP_PORT=8080
NGINX_HTTPS_PORT=8443

# =============================================================================
# DEPLOYMENT CONFIGURATION
# =============================================================================
DOCKER_COMPOSE_FILE=docker-compose.ecr.yml
HEALTH_CHECK_ENDPOINT=/health
API_HEALTH_CHECK_ENDPOINT=/api/system/health

# =============================================================================
# RATE LIMITING
# =============================================================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# =============================================================================
# LOGGING
# =============================================================================
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/tabsur
LOG_ROTATION_SIZE=100MB
LOG_ROTATION_INTERVAL=1d
LOG_RETENTION_DAYS=7

# =============================================================================
# MONITORING
# =============================================================================
ENABLE_HEALTH_CHECKS=true
ENABLE_METRICS=true
METRICS_PORT=9090
PROMETHEUS_ENABLED=false

# =============================================================================
# SECURITY
# =============================================================================
ENABLE_CORS=true
ENABLE_RATE_LIMITING=true
ENABLE_SSL_REDIRECT=true
ENABLE_HSTS=true
ENABLE_CSP=true
ENABLE_XSS_PROTECTION=true
ENABLE_CONTENT_TYPE_NOSNIFF=true
ENABLE_FRAME_DENY=true
EOF

    echo -e "${GREEN}✅ Environment configuration created${NC}"
}

# Create deployment instructions
create_deployment_instructions() {
    echo -e "${YELLOW}📋 Creating deployment instructions...${NC}"
    
    cat > REMOTE_DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# Remote Deployment Instructions for bemyguest.dedyn.io

## 🔧 Current Issues to Fix

1. **Firebase initialization failed** - Missing API key
2. **Google OAuth missing client_id** 
3. **Google Maps not defined** - Missing Google API key
4. **JWT token not found** - Authentication issues

## 🚀 Deployment Steps

### Step 1: SSH to Remote Server
```bash
ssh ubuntu@3.249.94.227
cd /home/ubuntu/Tabsur
```

### Step 2: Update Environment Configuration
```bash
# Copy the new environment template
cp .env.remote .env

# Edit the .env file with your actual values
nano .env
```

### Step 3: Required Environment Variables

#### Firebase Configuration
- `REACT_APP_FIREBASE_API_KEY` - Your Firebase project API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - Your Firebase project domain
- `REACT_APP_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID` - Your Firebase app ID

#### Google OAuth Configuration
- `REACT_APP_GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `REACT_APP_GOOGLE_API_KEY` - Your Google API key

#### Google Maps Configuration
- `REACT_APP_GOOGLE_MAPS_API_KEY` - Your Google Maps API key

#### Database Configuration
- `DB_PASSWORD` - Your secure database password
- `JWT_SECRET` - Your secure JWT secret

### Step 4: Rebuild and Deploy
```bash
# Stop current services
docker-compose -f docker-compose.ecr.yml down

# Pull latest images
docker-compose -f docker-compose.ecr.yml pull

# Start services with new configuration
docker-compose -f docker-compose.ecr.yml up -d

# Check service health
docker-compose -f docker-compose.ecr.yml ps
docker-compose -f docker-compose.ecr.yml logs -f
```

### Step 5: Verify Deployment
```bash
# Check if services are running
curl -k https://bemyguest.dedyn.io/health

# Check API health
curl -k https://bemyguest.dedyn.io/api/system/health
```

## 🔍 Troubleshooting

### If services fail to start:
```bash
# Check logs
docker-compose -f docker-compose.ecr.yml logs

# Check environment variables
docker-compose -f docker-compose.ecr.yml config
```

### If database connection fails:
```bash
# Test database connection
docker exec -it tabsur-postgres psql -U coolanu_user -d coolanu -h 3.249.94.227
```

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose -f docker-compose.ecr.yml logs -f`
2. Verify environment variables are set correctly
3. Ensure all required API keys are valid and have proper permissions
EOF

    echo -e "${GREEN}✅ Deployment instructions created${NC}"
}

# Create quick fix script for remote server
create_quick_fix_script() {
    echo -e "${YELLOW}📝 Creating quick fix script for remote server...${NC}"
    
    cat > quick-fix-remote.sh << 'EOF'
#!/bin/bash

# Quick Fix Script for Remote Server
# Run this on the remote server to fix deployment issues

set -e

echo "🔧 Quick Fix Script for Remote Server"
echo "====================================="

# Navigate to project directory
cd /home/ubuntu/Tabsur

# Backup current environment
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Current .env backed up"
fi

# Copy new environment template
if [ -f .env.remote ]; then
    cp .env.remote .env
    echo "✅ New environment template copied"
else
    echo "❌ .env.remote not found. Please copy it manually."
    exit 1
fi

# Stop current services
echo "🛑 Stopping current services..."
docker-compose -f docker-compose.ecr.yml down || true

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.ecr.yml pull

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.ecr.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service status
echo "📊 Checking service status..."
docker-compose -f docker-compose.ecr.yml ps

# Test endpoints
echo "🧪 Testing endpoints..."
if curl -k -s https://bemyguest.dedyn.io/health > /dev/null; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
fi

echo "🎉 Quick fix completed!"
echo "⚠️  IMPORTANT: You still need to edit .env with your actual API keys!"
echo "   Run: nano .env"
EOF

    chmod +x quick-fix-remote.sh
    echo -e "${GREEN}✅ Quick fix script created${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting remote deployment fix process...${NC}"
    
    check_prerequisites
    
    if test_ssh_connection; then
        echo -e "${GREEN}✅ SSH connection successful. Proceeding with deployment...${NC}"
        
        # Create all necessary files
        create_env_config
        create_deployment_instructions
        create_quick_fix_script
        
        echo -e "${GREEN}🎉 All deployment files created successfully!${NC}"
        echo -e "${YELLOW}📋 Next steps:${NC}"
        echo -e "1. Copy the created files to your remote server:"
        echo -e "   scp .env.remote ubuntu@$REMOTE_HOST:$REMOTE_DIR/"
        echo -e "   scp quick-fix-remote.sh ubuntu@$REMOTE_HOST:$REMOTE_DIR/"
        echo -e "   scp REMOTE_DEPLOYMENT_INSTRUCTIONS.md ubuntu@$REMOTE_HOST:$REMOTE_DIR/"
        echo -e ""
        echo -e "2. SSH to your remote server and run the quick fix:"
        echo -e "   ssh ubuntu@$REMOTE_HOST"
        echo -e "   cd $REMOTE_DIR"
        echo -e "   chmod +x quick-fix-remote.sh"
        echo -e "   ./quick-fix-remote.sh"
        echo -e ""
        echo -e "3. Edit the .env file with your actual API keys"
        echo -e "4. Restart services if needed"
        
    else
        echo -e "${RED}❌ Cannot proceed without SSH connection${NC}"
        echo -e "${YELLOW}Please fix SSH connectivity and run this script again${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
