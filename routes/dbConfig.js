module.exports = {
   pgConfigLocal : {
    host: '127.0.0.1',
    port: 5432,
    database: 'coolanu',
    user: 'coolanu',
    password: 'coolanu',
    ssl: false,
},
    pgConfigProduction : {
    host: 'coolanu.c83ccb9pqvdz.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'production_db',
    password: 'jw8s0F4',
    ssl: false,
}
};