const { Client } = require('pg');

const client = new Client({
  host: '3.249.94.227',
  port: 5432,
  database: 'coolanu',
  user: 'coolanu_user',
  password: 'coolanu123',
  ssl: false
});

async function testConnection() {
  try {
    console.log('🔌 Testing connection to new PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('📊 Database Info:', result.rows[0]);
    
    await client.end();
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
