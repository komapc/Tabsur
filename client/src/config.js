const config = {};

export const env = process.env.NODE_ENV;

switch(env) {
    case 'production':
        config.SERVER_HOST = 'https://coolanu.herokuapp.com';
        break;

    case "development":
    default:
        config.SERVER_HOST = 'http://localhost:5000'
}

export default config;
