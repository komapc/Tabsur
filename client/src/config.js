const config = {
  development: {
    SERVER_HOST: 'http://localhost:5000/api'
  },
  production: {
    SERVER_HOST: 'https://54.93.243.196/api'
  }
};

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
      // In production, use the local domain proxy to avoid CORS issues
      // Priority: REACT_APP_SERVER_HOST > REACT_APP_API_URL > local domain proxy
      config.SERVER_HOST = explicitApiUrl || 'http://54.93.243.196:8080';
    }
  }
}

console.log(`Using API base: ${config.SERVER_HOST}`);

// Google Maps configuration
config.GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
config.GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default config;
