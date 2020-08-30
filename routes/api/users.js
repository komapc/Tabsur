const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//const passport = require("passport");
const pgConfig = require("./../dbConfig.js");

const insertImageIntoDB = require("./images.js")
const { Client } = require("pg");
let currentConfig = pgConfig.pgConfigProduction;
if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
//const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, response) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);
  const input = req.body;

  const client = new Client(currentConfig);

  // Check validation
  if (!isValid) {
    console.log("invalid input: " + JSON.stringify(errors));
    return response.status(400).json(errors);
  }
  try {
    console.log("register.");
    const newUser = req.body;
    await client.connect();

    console.log("connected");
    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(input.password, salt, async (err, hash) => {
        if (err) throw err;

        client.query('INSERT INTO users (name, email, password, location, address)' +
          'VALUES ($1, $2, $3, $4, $5)',
          [newUser.name, newUser.email, hash, newUser.location, newUser.address])
          .then(user => {
            return response.status(201).json(user);
          })
          .catch(err => {
            console.error(err);
            return response.status(500).json(newUser);
          })
          .finally(() => {
            client.end();
          });
      });
    });

  }
  catch (e) {
    console.log("exception catched: " + e);
    return response.status(500).json(req.body);
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", async (req, response) => {
  // Form validation
  const newReq = req.body;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    console.log("invalid input: " + JSON.stringify(errors));
    return response.status(400).json(errors);
  }
  console.log(`Login: ${newReq.email}`);
  const client = new Client(currentConfig);
  await client.connect();
  client.query('SELECT id, name FROM users WHERE email = $1 OR id = $2 LIMIT 1',
    [newReq.email, newReq.id])
    .then(res => {

      //no record found
      if (res.rows === undefined || res.rows.length == 0) {
        console.log(`error: user [${newReq.email}]doesn't exist`);
        errors.email = "email not found";//emailnotfound
        return response.status(500).json(errors);
      }

      // Check password
      const row = res.rows[0];
      console.log('res: ' + JSON.stringify(res));
      console.log('row: ' + JSON.stringify(row));
      bcrypt.compare(newReq.password, row.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: row.id,
            name: row.name
          };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
                response.json({
                  success: true,
                  token: "Bearer " + token
                });
            }
          );
        } else {
          return response
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      })
        .catch(err => {
          console.error("bcrypt error:" + err);
          return response.status(500).json(newReq);
        })
        .finally(() => client.end())

    });
});

//add avatar path to images and update user_images table
const addAvatar = (client, userId, picture) =>
{
  console.log(`Add avatar: ${JSON.stringify(picture)}`);
  const query  = `
  INSERT INTO user_images
    (id, image_id)
    SELECT $1, $2
    WHERE
    NOT EXISTS (
    SELECT id FROM user_images WHERE id = $1 and image_id=$2
    );`;

    
  const url = picture.data.url;
  const newImageId = insertImageIntoDB(url, userId);

  if (newImageId > 0)
  {
    client.query(query, [newImageId, userId]);
  }
  else
  {
    console.error(`Add avatar got a negative image id ${newImageId}.`);
  }
}

// @route POST api/users/loginFB
// @desc Login user and return JWT token
// @access Public
router.post("/loginFB", async (req, response) => {
  // Form validation
  const newReq = req.body;
  var newUserId=-1;
  var newUserName=newReq.name;
  console.log(`Login with facebook: ${JSON.stringify(newReq)}`);
  const client = new Client(currentConfig);
  await client.connect();
  client.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [newReq.email])
    .then(res => {
      //no record found, new FB user
      if (res.rows === undefined || res.rows.length == 0) {
        console.log(`fb user doesn't exist (${newReq.email}), adding to the DB`);
        const addUserQuery = `INSERT INTO users (name, email, password, location, address)
        VALUES ($1, $2, $3, $4, $5) RETURNING id`; 
        return client.query(addUserQuery,
          [newReq.name, newReq.email, newReq.accessToken, "(0,0)", ""])
          .then(user => {
            // return response.status(201).json(user);
            console.log(`New record created: ${JSON.stringify(user)}`);
            newUserId=user; 
          })
          .catch(err => {
            console.error(`Inserting user failed:  ${err}`);
            return response.status(500).json(err);
          })
          .finally()
          {
          }
      }
      else
      {
        newUserId = res.rows[0].id;
        console.log(`Known user logged-in via fb: ${newReq.email}`);
      }

      // Check password
      const row = res.rows[0];
      const payload = {
        id: newUserId,
        name: newUserName
      };

      // Sign token
      jwt.sign(
        payload,
        keys.secretOrKey,
        {
          expiresIn: 31556926 // 1 year in seconds
        },
        (err, token) => {
          response.json({
            success: true,
            token: "Bearer " + token
          });
        }
      );
    })
  .catch(err => {
    console.error("fb user error:" + err);
    return response.status(500).json(newReq);
  })
  .finally(() =>
  {
    addAvatar(client, newUserId, newReq.picture);
    client.end();
  })
  
})
// @route GET api/users
// @desc get public user properties
// @access Public
router.get("/:id", async (req, response) => {
  // Find the user
  const client = new Client(currentConfig);
  await client.connect()
  .catch(err => {
    console.error(err);
    return response.status(500).json(err);
  });
  return client.query(`SELECT id, name, 100 AS rate,
  (SELECT COUNT (1) FROM meals WHERE host_id = $1) AS meals_created,
  (SELECT count(1) AS following FROM follow WHERE follower=$1),
  (SELECT count(1) AS followers FROM follow WHERE id=$1)
  FROM users WHERE id = $1`, [req.params.id])//
    .then(user => {
      response.json(user.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json("No user");
    })
    .finally(() => {
      client.end();
    });
});


module.exports = router;
