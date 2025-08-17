const config = {};

export const env = process.env.NODE_ENV;

//export const env = "production"; //hardcoded bullshit! TODO: 
const host = document.location.protocol + "//" + document.location.host;
console.log(`host: ${host}`);

console.log("Config.js, env = " + JSON.stringify(process.env.NODE_ENV));
switch (env) {
    case "development":
        config.SERVER_HOST = process.env.REACT_APP_SERVER_HOST_DEV || 'http://localhost:5000';
        break;
    case 'production':
    default:
        config.SERVER_HOST = process.env.REACT_APP_SERVER_HOST || host;
}

// Google Maps configuration
config.GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
config.GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default config;
