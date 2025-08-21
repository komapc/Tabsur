const config = {};

export const env = process.env.NODE_ENV || 'development';

// Build the current origin for reference
const host = document.location.protocol + "//" + document.location.host;
console.log(`host: ${host}`);

console.log("Config.js, env = " + JSON.stringify(env));

// Prefer explicitly provided API host variables
const rawExplicitApiUrl = process.env.REACT_APP_SERVER_HOST || process.env.REACT_APP_API_URL || '';
// Normalize: strip any trailing '/api' because our code appends '/api/...'
const explicitApiUrl = rawExplicitApiUrl.replace(/\/+api\/?$/i, '');

switch (env) {
  case "development":
  case undefined:
  case null: {
    const devHost = process.env.REACT_APP_SERVER_HOST_DEV || process.env.REACT_APP_SERVER_HOST || explicitApiUrl;
    config.SERVER_HOST = (devHost && devHost.trim()) ? devHost : 'http://localhost:5000';
    break;
  }
  case 'production':
  default: {
    // When serving locally (localhost:3000), prefer local API unless explicitly overridden
    const isLocalFrontend = /localhost|127\.0\.0\.1/i.test(host);
    if (isLocalFrontend) {
      const localPref = explicitApiUrl || 'http://localhost:5000';
      config.SERVER_HOST = localPref;
    } else {
      // In production we MUST talk to the API subdomain, not the frontend origin
      // Priority: REACT_APP_SERVER_HOST > REACT_APP_API_URL > default api domain
      config.SERVER_HOST = explicitApiUrl || 'https://api.bemyguest.dedyn.io';
    }
  }
}

console.log(`Using API base: ${config.SERVER_HOST}`);

// Google Maps configuration
config.GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
config.GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default config;
