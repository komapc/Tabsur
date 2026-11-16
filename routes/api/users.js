const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const keys = require('../../config/keys');
const insertImageIntoDB = require('./utility.js');
const pool = require('../db.js');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const ACCESS_TOKEN_TTL = 15 * 60;            // 15 minutes in seconds
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');

const issueTokens = (res, userId, name) => {
  return new Promise((resolve, reject) => {
    const payload = { id: userId, name };
    jwt.sign(payload, keys.secretOrKey, { expiresIn: ACCESS_TOKEN_TTL }, async (err, accessToken) => {
      if (err) return reject(err);
      const rawRefresh = crypto.randomBytes(64).toString('hex');
      const tokenHash = hashToken(rawRefresh);
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
      const client = await pool.connect();
      client.query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
        [userId, tokenHash, expiresAt]
      )
        .then(() => {
          const isProduction = process.env.NODE_ENV === 'production';
          res.cookie('refreshToken', rawRefresh, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
            maxAge: REFRESH_TOKEN_TTL_MS,
            path: '/api/users'
          });
          resolve('Bearer ' + accessToken);
        })
        .catch(reject)
        .finally(() => client.release());
    });
  });
};

// @route POST api/users/register;
// @desc Register user;
// @access Public;
router.post('/register', async (req, response) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  const input = req.body;
  // Check validation;
  if (!isValid) {
    console.error(`Invalid input: ${JSON.stringify(errors)}`);
    return response.status(400).json(errors);
  }
  try {
    console.log('register.');
    const newUser = req.body;
    const client = await pool.connect();
    console.log('connected');
    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(input.password, salt, async (err, hash) => {
        if (err) {
          console.error(`bcrypt failed: ${JSON.stringify(err)}.`);
          throw err;
        }
        const locationStr = newUser.location
          ? `(${newUser.location.lng}, ${newUser.location.lat})`
          : '(0, 0)';
        client.query(`INSERT INTO users (name, email, password, location, address)
        VALUES ($1, $2, $3, $4, $5)`,
        [newUser.name, newUser.email, hash, locationStr, newUser.address])
          .then(user => {
            return response.status(201).json(user);
          })
          .catch(err => {
            console.error(`Insert query failed: ${JSON.stringify(err)}`);
            // Check if it's a duplicate email error
            if (err.code === '23505' && err.constraint === 'unique_user_email') {
              return response.status(400).json({ email: 'Email already exists' });
            }
            return response.status(500).json({ error: 'Registration failed' });
          })
          .finally(() => {
            client.release();
          });
      });
    });
  }
  catch (e) {
    console.error('register exception: ' + e);
    return response.status(500).json({ error: 'Registration failed' });
  }
});

// @route POST api/users/login;
// @desc Login user and return JWT token;
// @access Public;
router.post('/login', async (req, response) => {
  const newReq = req.body;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    console.log(`Invalid input: ${JSON.stringify(errors)}.`);
    return response.status(400).json(errors);
  }
  console.log(`Login: ${newReq.email}.`);
  const client = await pool.connect();
  client.query('SELECT id, name, password FROM users WHERE email = $1 OR id = $2 LIMIT 1',
    [newReq.email, newReq.id])
    .then(res => {
      if (res.rows === undefined || res.rows.length === 0) {
        console.error(`error: user [${newReq.email}] doesn't exist.`);
        errors.email = 'email not found';
        return response.status(404).json(errors);
      }
      const row = res.rows[0];
      return bcrypt.compare(newReq.password, row.password).then(isMatch => {
        if (isMatch) {
          return issueTokens(response, row.id, row.name).then(token => {
            response.json({ success: true, token });
          });
        } else {
          return response.status(400).json({ passwordincorrect: 'Password incorrect' });
        }
      });
    })
    .catch(err => {
      console.error('login error:' + err);
      return response.status(500).json({ error: 'Login failed' });
    })
    .finally(() => client.release());
});

//add avatar path to images and update user_images table;
const addAvatar = async (userId, picture) => {
  if (!picture || !picture.data || !picture.data.url) {
    return;
  }
  const query = `
  INSERT INTO user_images
  (image_id, user_id)
  SELECT $1, $2
  WHERE
  NOT EXISTS (
  SELECT id FROM user_images WHERE image_id = $1 and user_id=$2
  )`;
  const url = picture.data.url;
  return insertImageIntoDB(url, userId)
    .then(async (newImageId) => {
      if (newImageId > 0) {
        const client = await pool.connect();
        return client.query(query, [newImageId, userId]).finally(() => {
          client.release();
        });
      }
      console.error(`Add avatar got a negative image id ${newImageId}.`);
    })
    .catch((err) => {
      console.error(`Add avatar error: ${err}.`);
    });
};

// Verify a Facebook user access token server-side and return the Graph profile
// ({id, name, email, picture}) or null. Never trust identity fields from the client.
const verifyFacebookToken = async accessToken => {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appId || !appSecret || typeof accessToken !== 'string' || !accessToken) {
    return null;
  }
  const graph = 'https://graph.facebook.com';
  const appToken = encodeURIComponent(`${appId}|${appSecret}`);
  const debug = await fetch(`${graph}/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${appToken}`)
    .then(r => r.json());
  const data = debug && debug.data;
  if (!data || data.is_valid !== true || String(data.app_id) !== String(appId)) {
    return null;
  }
  const me = await fetch(`${graph}/me?fields=id,name,email,picture&access_token=${encodeURIComponent(accessToken)}`)
    .then(r => r.json());
  if (!me || !me.email || String(me.id) !== String(data.user_id)) {
    return null;
  }
  return me;
};

// @route POST api/users/loginFB;
// @desc Login user with a Facebook access token and return JWT token;
// @access Public;
router.post('/loginFB', async (req, response) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return response.status(503).json({ error: 'Facebook login is not configured' });
  }
  const accessToken = req.body && req.body.accessToken;
  let profile;
  try {
    profile = await verifyFacebookToken(accessToken);
  } catch (err) {
    console.error(`Facebook token verification failed: ${err}`);
    return response.status(502).json({ error: 'Facebook verification failed' });
  }
  if (!profile) {
    return response.status(401).json({ error: 'Invalid Facebook token' });
  }
  const client = await pool.connect();
  let userId = -1;
  client.query('SELECT id, name FROM users WHERE email = $1 LIMIT 1', [profile.email])
    .then(async res => {
      if (res.rows && res.rows.length > 0) {
        userId = res.rows[0].id;
        return;
      }
      // No usable password for Facebook-only accounts: store a hash of random bytes.
      const unusable = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
      const inserted = await client.query(`INSERT INTO users (name, email, password, location, address)
      VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [profile.name, profile.email, unusable, '(0,0)', '']);
      userId = inserted.rows[0].id;
    })
    .then(() => issueTokens(response, userId, profile.name))
    .then(token => {
      response.json({ success: true, token });
      addAvatar(userId, profile.picture);
    })
    .catch(err => {
      console.error('fb login error:' + err);
      return response.status(500).json({ error: 'Facebook login failed' });
    })
    .finally(() => client.release());
});

// @route POST api/users/refresh
// @desc Issue a new access token from a valid refresh token cookie
// @access Public (cookie auth)
router.post('/refresh', async (req, response) => {
  const rawRefresh = req.cookies && req.cookies.refreshToken;
  if (!rawRefresh) {
    return response.status(401).json({ error: 'No refresh token' });
  }
  const tokenHash = hashToken(rawRefresh);
  const client = await pool.connect();
  client.query(
    `SELECT rt.user_id, u.name FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1 AND rt.expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  )
    .then(res => {
      if (!res.rows.length) {
        return response.status(401).json({ error: 'Invalid or expired refresh token' });
      }
      const { user_id, name } = res.rows[0];
      return issueTokens(response, user_id, name).then(token => {
        response.json({ success: true, token });
      });
    })
    .catch(err => {
      console.error('refresh error:' + err);
      return response.status(500).json({ error: 'Refresh failed' });
    })
    .finally(() => client.release());
});

// @route POST api/users/logout
// @desc Revoke refresh token and clear cookie
// @access Public
router.post('/logout', async (req, response) => {
  const rawRefresh = req.cookies && req.cookies.refreshToken;
  const isProduction = process.env.NODE_ENV === 'production';
  response.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/api/users'
  });
  if (!rawRefresh) {
    return response.json({ success: true });
  }
  const tokenHash = hashToken(rawRefresh);
  const client = await pool.connect();
  client.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash])
    .then(() => response.json({ success: true }))
    .catch(err => {
      console.error('logout error:' + err);
      response.json({ success: true }); // clear cookie even on DB error
    })
    .finally(() => client.release());
});

// @route GET api/users;
// @desc get public user properties;
// @access Public;
router.get('/:id', async (req, response) => {
  const client = await pool.connect();
  return client.query(`
  SELECT
  id,
  name,
  100 AS rate,
  (SELECT COUNT (1) FROM meals WHERE host_id = $1) AS meals_created,
  (SELECT count(1) AS following FROM follow WHERE follower=$1),
  (SELECT count(1) AS followers FROM follow WHERE followie=$1),
  (SELECT COUNT (1) FROM meals WHERE host_id = $1 AND date > CURRENT_TIMESTAMP) AS active_meals
  FROM users WHERE id = $1
  `, [req.params.id])
    .then(user => {
      response.json(user.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json('No user');
    })
    .finally(() => {
      client.release();
    });
});

module.exports = router;
