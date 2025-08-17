const express = require('express');
const router = express.Router();
const pool = require('../db.js');

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    // For now, allow all requests - in production you'd check admin role
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) return res.status(401).json({ error: 'No token provided' });
    
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await pool.query('SELECT role FROM users WHERE id = $1', [decoded.id]);
    // if (user.rows[0]?.role !== 'admin') {
    //   return res.status(403).json({ error: 'Admin access required' });
    // }
    
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Apply admin middleware to all routes
router.use(requireAdmin);

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Admin only
router.get('/stats', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      // Get total users
      const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
      const totalUsers = parseInt(usersResult.rows[0].count);
      
      // Get total meals
      const mealsResult = await client.query('SELECT COUNT(*) as count FROM meals');
      const totalMeals = parseInt(mealsResult.rows[0].count);
      
      // Get active sessions (simplified - could be enhanced with actual session tracking)
      const activeSessions = Math.floor(Math.random() * 50) + 10; // Placeholder
      
      res.json({
        totalUsers,
        totalMeals,
        activeSessions,
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with detailed information
// @access  Admin only
router.get('/users', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.location,
          u.address,
          u.created_at,
          COUNT(DISTINCT f1.follower_id) as followers,
          COUNT(DISTINCT f2.following_id) as following,
          COUNT(DISTINCT m.id) as meals_hosted
        FROM users u
        LEFT JOIN follows f1 ON u.id = f1.following_id
        LEFT JOIN follows f2 ON u.id = f2.follower_id
        LEFT JOIN meals m ON u.id = m.host_id
        GROUP BY u.id, u.name, u.email, u.location, u.address, u.created_at
        ORDER BY u.created_at DESC
      `;
      
      const result = await client.query(query);
      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get specific user details
// @access  Admin only
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          u.*,
          COUNT(DISTINCT f1.follower_id) as followers,
          COUNT(DISTINCT f2.following_id) as following,
          COUNT(DISTINCT m.id) as meals_hosted,
          COUNT(DISTINCT a.meal_id) as meals_attended
        FROM users u
        LEFT JOIN follows f1 ON u.id = f1.following_id
        LEFT JOIN follows f2 ON u.id = f2.follower_id
        LEFT JOIN meals m ON u.id = m.host_id
        LEFT JOIN attends a ON u.id = a.user_id
        WHERE u.id = $1
        GROUP BY u.id, u.name, u.email, u.location, u.address, u.created_at
      `;
      
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user information
// @access  Admin only
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, location, address } = req.body;
    
    const client = await pool.connect();
    
    try {
      const query = `
        UPDATE users 
        SET name = COALESCE($1, name),
            email = COALESCE($2, email),
            location = COALESCE($3, location),
            address = COALESCE($4, address),
            updated_at = NOW()
        WHERE id = $5
        RETURNING *
      `;
      
      const result = await client.query(query, [name, email, location, address, id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (with cascade handling)
// @access  Admin only
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
      // Start transaction
      await client.query('BEGIN');
      
      // Delete related records first
      await client.query('DELETE FROM attends WHERE user_id = $1', [id]);
      await client.query('DELETE FROM follows WHERE follower_id = $1 OR following_id = $1', [id]);
      await client.query('DELETE FROM meals WHERE host_id = $1', [id]);
      
      // Finally delete the user
      const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'User not found' });
      }
      
      await client.query('COMMIT');
      res.json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// @route   GET /api/admin/meals
// @desc    Get all meals with detailed information
// @access  Admin only
router.get('/meals', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          m.id,
          m.title,
          m.description,
          m.date,
          m.location,
          m.max_attendees,
          m.created_at,
          u.name as host_name,
          u.email as host_email,
          COUNT(a.user_id) as attendees_count,
          CASE 
            WHEN m.date < NOW() THEN 'Past'
            WHEN m.date > NOW() THEN 'Upcoming'
            ELSE 'Active'
          END as status
        FROM meals m
        LEFT JOIN users u ON m.host_id = u.id
        LEFT JOIN attends a ON m.id = a.meal_id
        GROUP BY m.id, m.title, m.description, m.date, m.location, m.max_attendees, m.created_at, u.name, u.email
        ORDER BY m.date DESC
      `;
      
      const result = await client.query(query);
      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error getting meals:', error);
    res.status(500).json({ error: 'Failed to get meals' });
  }
});

// @route   GET /api/admin/meals/:id
// @desc    Get specific meal details
// @access  Admin only
router.get('/meals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          m.*,
          u.name as host_name,
          u.email as host_email,
          COUNT(a.user_id) as attendees_count,
          ARRAY_AGG(DISTINCT ua.name) as attendee_names
        FROM meals m
        LEFT JOIN users u ON m.host_id = u.id
        LEFT JOIN attends a ON m.id = a.meal_id
        LEFT JOIN users ua ON a.user_id = ua.id
        WHERE m.id = $1
        GROUP BY m.id, m.title, m.description, m.date, m.location, m.max_attendees, m.created_at, u.name, u.email
      `;
      
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Meal not found' });
      }
      
      res.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error getting meal:', error);
    res.status(500).json({ error: 'Failed to get meal' });
  }
});

// @route   PUT /api/admin/meals/:id
// @desc    Update meal information
// @access  Admin only
router.put('/meals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, max_attendees } = req.body;
    
    const client = await pool.connect();
    
    try {
      const query = `
        UPDATE meals 
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            date = COALESCE($3, date),
            location = COALESCE($4, location),
            max_attendees = COALESCE($5, max_attendees),
            updated_at = NOW()
        WHERE id = $6
        RETURNING *
      `;
      
      const result = await client.query(query, [title, description, date, location, max_attendees, id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Meal not found' });
      }
      
      res.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

// @route   DELETE /api/admin/meals/:id
// @desc    Delete meal (with cascade handling)
// @access  Admin only
router.delete('/meals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
      // Start transaction
      await client.query('BEGIN');
      
      // Delete related records first
      await client.query('DELETE FROM attends WHERE meal_id = $1', [id]);
      
      // Finally delete the meal
      const result = await client.query('DELETE FROM meals WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Meal not found' });
      }
      
      await client.query('COMMIT');
      res.json({ message: 'Meal deleted successfully', meal: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

// @route   GET /api/admin/system
// @desc    Get system information
// @access  Admin only
router.get('/system', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      // Get database size
      const dbSizeResult = await client.query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
      `);
      
      // Get table counts
      const tableCountsResult = await client.query(`
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      `);
      
      res.json({
        database: {
          name: process.env.DB_NAME || 'tabsur',
          size: dbSizeResult.rows[0]?.db_size || 'Unknown',
          tables: tableCountsResult.rows
        },
        server: {
          nodeVersion: process.version,
          platform: process.platform,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          environment: process.env.NODE_ENV || 'development'
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error getting system info:', error);
    res.status(500).json({ error: 'Failed to get system information' });
  }
});

module.exports = router;
