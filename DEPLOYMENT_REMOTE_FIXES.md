# Remote Deployment Fixes Guide

## 🚨 Critical Issues Found on Remote Deployment

### 1. **Firebase Configuration Missing**
**Error**: `Firebase initialization failed - notifications will be disabled: Installations: Missing App configuration value: "apiKey"`

**Fix**: Add these environment variables to your production `.env` file:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_actual_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
```

### 2. **Google OAuth Client ID Missing**
**Error**: `Missing required parameter client_id`

**Fix**: Add these environment variables:

```bash
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
REACT_APP_GOOGLE_API_KEY=your_google_api_key
```

### 3. **Google Maps Not Loading**
**Error**: `Uncaught ReferenceError: google is not defined`

**Fix**: Ensure Google Maps API key is properly set:

```bash
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key
```

## 🔧 Step-by-Step Fix Process

### Step 1: Update Production Environment File
1. SSH into your production server
2. Navigate to your project directory
3. Copy the updated `env.https.template` to `.env`
4. Fill in all the actual values (not placeholders)

### Step 2: Verify Environment Variables
```bash
# Check if all required variables are set
grep -E "REACT_APP_|GOOGLE_|FIREBASE_" .env

# Should show all required variables with actual values
```

### Step 3: Rebuild and Redeploy
```bash
# Rebuild the application with new environment variables
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Or if using ECR
./fast-ecr-deploy.sh
```

### Step 4: Verify Fixes
1. Check browser console for errors
2. Verify Firebase initialization
3. Test Google OAuth login
4. Confirm Google Maps loading

## 📋 Required Environment Variables Checklist

### Firebase (Required for Notifications)
- [ ] `REACT_APP_FIREBASE_API_KEY`
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN`
- [ ] `REACT_APP_FIREBASE_PROJECT_ID`
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET`
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `REACT_APP_FIREBASE_APP_ID`

### Google OAuth (Required for Login)
- [ ] `REACT_APP_GOOGLE_CLIENT_ID`
- [ ] `REACT_APP_GOOGLE_API_KEY`

### Google Maps (Required for Map Features)
- [ ] `REACT_APP_GOOGLE_MAPS_API_KEY`

### Database & Security
- [ ] `DB_PASSWORD` (actual secure password)
- [ ] `JWT_SECRET` (actual secure secret)
- [ ] `CORS_ORIGIN` (your domain)

## 🚫 Common Mistakes to Avoid

1. **Using placeholder values** - Replace all `your_*_here` values
2. **Missing quotes** - Ensure string values are properly quoted
3. **Wrong environment** - Make sure you're editing the production `.env` file
4. **Not rebuilding** - Environment variable changes require rebuild
5. **Caching issues** - Clear browser cache after deployment

## 🔍 Troubleshooting Commands

### Check Environment Variables
```bash
# View current environment variables
cat .env | grep -E "REACT_APP_|GOOGLE_|FIREBASE_"

# Check if variables are loaded
docker exec -it container_name env | grep -E "REACT_APP_|GOOGLE_|FIREBASE_"
```

### Check Application Logs
```bash
# View application logs
docker-compose logs -f client
docker-compose logs -f server

# Check for specific errors
docker-compose logs client | grep -i "firebase\|google\|error"
```

### Verify Configuration
```bash
# Test Firebase config endpoint
curl https://your-domain.com/api/system/firebase-config

# Test Google Maps loading
curl https://your-domain.com/api/system/maps-config
```

## 📞 Getting Required Values

### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Copy the configuration values

### Google OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services > Credentials
4. Create or copy OAuth 2.0 Client ID

### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services > Credentials
4. Create or copy API Key

## ✅ Success Indicators

After fixing, you should see:
- ✅ No Firebase initialization errors
- ✅ Google OAuth login working
- ✅ Google Maps loading properly
- ✅ No console errors related to missing configuration
- ✅ All features functioning normally

## 🚨 Emergency Rollback

If something goes wrong:
```bash
# Rollback to previous version
docker-compose down
git checkout HEAD~1
docker-compose up -d

# Or restore from backup
docker-compose down
cp .env.backup .env
docker-compose up -d
```

---

**Remember**: Never commit actual API keys or secrets to version control. Always use environment variables for production deployments.
