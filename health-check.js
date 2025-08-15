#!/usr/bin/env node

/**
 * Health Check Script for Tabsur Development
 * Verifies that all components are running properly
 */

const express = require('express');
const cors = require('cors');
const pool = require('./routes/db');

const app = express();

// Enable CORS
app.use(cors());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Database connection test endpoint
app.get('/db-test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    client.release();

    res.status(200).json({
      status: 'OK',
      database: 'PostgreSQL',
      version: result.rows[0].version
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});

module.exports = app;