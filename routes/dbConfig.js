require('dotenv').config();
module.exports = {
    host: process.env.PG_HOST,
    port: 5432,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: false,
};