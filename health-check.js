#!/usr/bin/env node

/**
 * Health Check Script for BeMyGuest Development
 * Verifies that all components are running properly
 */

const http = require('http');
const { Client } = require('pg');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => console.log(`${color}${message}${colors.reset}`);

async function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/health', (res) => {
      if (res.statusCode === 200) {
        log(colors.green, '✅ Server is running on port 5000');
        resolve(true);
      } else {
        log(colors.red, '❌ Server health check failed');
        resolve(false);
      }
    });
    
    req.on('error', () => {
      log(colors.red, '❌ Server is not running on port 5000');
      resolve(false);
    });
  });
}

async function checkClient() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        log(colors.green, '✅ Client is running on port 3000');
        resolve(true);
      } else {
        log(colors.red, '❌ Client health check failed');
        resolve(false);
      }
    });
    
    req.on('error', () => {
      log(colors.red, '❌ Client is not running on port 3000');
      resolve(false);
    });
  });
}

async function checkDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'coolanu',
    user: 'coolanu',
    password: 'coolanu'
  });

  try {
    await client.connect();
    const result = await client.query('SELECT 1 as health_check');
    if (result.rows[0].health_check === 1) {
      log(colors.green, '✅ Database is connected and responding');
      return true;
    }
  } catch (error) {
    log(colors.red, '❌ Database connection failed');
    return false;
  } finally {
    await client.end();
  }
}

async function main() {
  log(colors.blue, '🔍 Running BeMyGuest Health Check...\n');
  
  const [serverOk, clientOk, dbOk] = await Promise.all([
    checkServer(),
    checkClient(), 
    checkDatabase()
  ]);

  console.log(''); // Empty line
  
  if (serverOk && clientOk && dbOk) {
    log(colors.green, '🎉 All systems are running properly!');
    log(colors.blue, '📍 Access your application at: http://localhost:3000');
    process.exit(0);
  } else {
    log(colors.yellow, '⚠️  Some issues detected. Run `npm run debug` to start all services.');
    process.exit(1);
  }
}

main().catch(console.error);