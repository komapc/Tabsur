module.exports = {
  pgConfigLocal : {
    host: '127.0.0.1',
    port: 5432,
    database: 'coolanu',
    user: 'coolanu',
    password: 'coolanu',
    ssl: false
  },
  pgConfigTest : {
    host: '127.0.0.1',
    port: process.env.DB_PORT || 5433,
    database: process.env.DB_NAME || 'coolanu_test',
    user: 'coolanu',
    password: 'coolanu',
    ssl: false
  },
  pgConfigProduction : {
    host: process.env.PG_HOST || '3.249.94.227',
    port: 5432,
    database: process.env.PG_DATABASE || 'coolanu',
    user: process.env.PG_USER || 'coolanu_user',
    password: process.env.PG_PASSWORD || 'coolanu123',
    ssl: false
  },
  pgConfigSelfManaged : {
    host: '3.249.94.227',
    port: 5432,
    database: 'coolanu',
    user: 'coolanu_user',
    password: 'coolanu123',
    ssl: false
  }
};