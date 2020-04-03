const config = {};

export const env = process.env.NODE_ENV;
console.log("Config.js, env = " + env);
switch(env) {
    case "development":
        config.SERVER_HOST = 'http://localhost:5000';
        break;
    case 'production':
    default:
        config.SERVER_HOST = 'https://coolanu.herokuapp.com';
    
}

export default config;
