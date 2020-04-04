const config = {};

//export const env = process.env.NODE_ENV;

export const env = "production"; //hardcoded bullshit! TODO: 
console.log("Config.js, env = " + JSON.stringify(process.env.NODE_ENV));
switch(env) {
    case "development":
        config.SERVER_HOST = 'http://localhost:5000';
        break;
    case 'production':
    default:
        config.SERVER_HOST = 'http://coolanu.herokuapp.com';
    
}

export default config;
