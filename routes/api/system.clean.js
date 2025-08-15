const express = require('express');
const router = express.Router();

// @route GET api/system/health
// @desc get system health status
// @access Public
router.get('/health', (req, response) => {
  console.log('Get system health.');
  const resp = {
    DB: 'checking',
    server: true,
    mealsCreatedToday: 0,
    users: 0,
    onlineUsers: 0,
    activeMeals: 0
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
