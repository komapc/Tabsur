# Google Maps API Setup Guide

## Current Issues Fixed

1. **@emotion/react duplicate loading warning** - Fixed by updating to compatible versions
2. **Multiple Google Places libraries** - Removed conflicting dependencies
3. **Google Maps API billing error** - Added proper error handling and user guidance

## To Fix Google Maps API Billing Error

The error "You must enable Billing on the Google Cloud Project" means your Google Cloud project doesn't have billing enabled.

### Steps to Fix:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Enable Billing**
   - Go to **Billing** in the left sidebar
   - Click **Link a billing account**
   - Follow the prompts to add a billing method

3. **Enable Required APIs**
   - Go to **APIs & Services** > **Library**
   - Search for and enable these APIs:
     - **Maps JavaScript API**
     - **Places API**
     - **Geocoding API**

4. **Configure API Key**
   - Go to **APIs & Services** > **Credentials**
   - Create a new API key or update existing one
   - Add proper restrictions (domain, IP, etc.)

5. **Update Environment File**
   - Copy your new API key to `client/.env`
   - Set: `REACT_APP_GOOGLE_MAPS_API_KEY=your_new_key_here`

### Alternative: Use Without Google Maps

If you can't enable billing, the app will show a helpful error message and allow manual address input.

## Dependencies Updated

- Removed: `react-google-autocomplete`, `react-places-autocomplete`
- Updated: `@emotion/react` to `^11.11.3` for MUI v7 compatibility
- Kept: `react-google-places-autocomplete` (single, working library)

## Testing

After fixing the billing issue:
1. Restart the client: `npm start`
2. Try creating a meal
3. Location selector should work without errors
