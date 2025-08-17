# 🗺️ Google Maps Setup Guide

## **Problem: Map View Not Working**

The map view requires a valid Google Maps API key to function. Currently, the API key is not configured.

## **Solution: Set Up Google Maps API Key**

### **Step 1: Get a Google Maps API Key**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### **Step 2: Configure Environment Variables**

Create a `.env` file in the `client` directory:

```bash
# Navigate to client directory
cd client

# Create .env file
touch .env
```

Add the following content to `.env`:

```env
# Google Maps API Key for client-side usage
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Development server host (for local development)
REACT_APP_SERVER_HOST=http://localhost:5000

# Google OAuth Client ID (if using Google login)
REACT_APP_GOOGLE_API_KEY=your_google_oauth_client_id_here
```

### **Step 3: Restart Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

### **Step 4: Test the Map**

1. Switch to the "Map" tab in your app
2. You should now see the Google Maps interface
3. Meals will appear as markers on the map

## **Security Notes**

- **Never commit your `.env` file to git**
- **Restrict your API key to specific domains**
- **Monitor your API usage to avoid unexpected charges**

## **Alternative: Use a Test API Key**

For development/testing, you can use a temporary API key, but remember to:
- Set usage limits
- Monitor usage
- Replace with production key before deployment

## **Troubleshooting**

If the map still doesn't work after setting the API key:

1. Check browser console for errors
2. Verify the API key is correct
3. Ensure the Maps JavaScript API is enabled
4. Check if there are any billing issues with your Google Cloud account

## **Need Help?**

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
