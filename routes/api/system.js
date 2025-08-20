const express = require('express');
const router = express.Router();
const pool = require('../db');

// @route GET api/system/health
// @desc get system health status
// @access Public
router.get('/health', async (req, response) => {
  console.log('Get system health.');
  
  let dbStatus = 'checking';
  let mealsCreatedToday = 0;
  let users = 0;
  let onlineUsers = 0;
  let activeMeals = 0;
  
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    dbStatus = 'connected';
    
    // Get basic stats if database is connected
    try {
      const statsResult = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM users) as user_count,
          (SELECT COUNT(*) FROM meals WHERE DATE(created_at) = CURRENT_DATE) as meals_today,
          (SELECT COUNT(*) FROM meals WHERE date > NOW()) as active_meals
      `);
      
      if (statsResult.rows.length > 0) {
        users = parseInt(statsResult.rows[0].user_count) || 0;
        mealsCreatedToday = parseInt(statsResult.rows[0].meals_today) || 0;
        activeMeals = parseInt(statsResult.rows[0].active_meals) || 0;
      }
    } catch (statsError) {
      console.warn('Could not fetch stats:', statsError.message);
      // Continue with default values
    }
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
    dbStatus = 'disconnected';
  }
  
  const resp = {
    DB: dbStatus,
    server: true,
    mealsCreatedToday,
    users,
    onlineUsers,
    activeMeals
  };
  
  response.json(resp);
});

// @route GET api/system/status
// @desc get basic server status
// @access Public
router.get('/status', (req, response) => {
  response.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
