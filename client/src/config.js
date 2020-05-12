const config = {};

export const env = process.env.NODE_ENV;

//export const env = "production"; //hardcoded bullshit! TODO: 
const host=document.location.protocol +"//" + document.location.host;
console.log(`host: ${host}`);

console.log("Config.js, env = " + JSON.stringify(process.env.NODE_ENV));
switch(env) {
    case "development":
        config.SERVER_HOST = 'http://localhost:5000';
        break;
    case 'production':
    default:
        config.SERVER_HOST = host;//'http://coolanu.herokuapp.com';
    
}

export default config;
