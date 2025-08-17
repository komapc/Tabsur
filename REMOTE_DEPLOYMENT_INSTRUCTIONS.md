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
