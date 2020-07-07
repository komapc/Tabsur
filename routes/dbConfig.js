module.exports = {
    pgConfigLocal : {
        host: '127.0.0.1',
        port: 5432,
        database: 'coolanu',
        user: 'coolanu',
        password: 'coolanu',
        ssl: false
    },
    pgConfigProduction : {
        host: process.env.PG_HOST,
        port: 5432,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        ssl: false
    }
};