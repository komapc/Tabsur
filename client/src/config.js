const config = {};

export const env = process.env.NODE_ENV;

// Build the current origin for reference
const host = document.location.protocol + "//" + document.location.host;
console.log(`host: ${host}`);

console.log("Config.js, env = " + JSON.stringify(process.env.NODE_ENV));

// Prefer explicitly provided API host variables
const explicitApiUrl = process.env.REACT_APP_SERVER_HOST || process.env.REACT_APP_API_URL;

switch (env) {
  case "development":
    // Local development backend (force localhost if not explicitly overridden)
    config.SERVER_HOST = process.env.REACT_APP_SERVER_HOST_DEV || process.env.REACT_APP_SERVER_HOST || 'http://localhost:5000';
    break;
  case 'production':
  default:
    // In production we MUST talk to the API subdomain, not the frontend origin
    // Priority: REACT_APP_SERVER_HOST > REACT_APP_API_URL > default api domain
    config.SERVER_HOST = explicitApiUrl || 'https://api.bemyguest.dedyn.io';
}

console.log(`Using API base: ${config.SERVER_HOST}`);

// Google Maps configuration
config.GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
config.GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default config;
