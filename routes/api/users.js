const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//const passport = require("passport");
const pgConfig = require("./../dbConfig.js");
const { Client } = require("pg");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, response) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);
  const input = req.body;


  const client = new Client(pgConfig.pgConfig);

  // Check validation
  if (!isValid) {
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
        //input.password = hash;
        await client.query('INSERT INTO users (name, email, password, location, address)' +
          'VALUES ($1, $2, $3, $4, $5)',
          [newUser.name, newUser.email, hash, `33,33`, 'address'])
          .then(user => { return response.status(201).json(newUser); })
          .catch(err => { console.log(err); return response.status(500).json(newUser); });
        // TODO: fix user id
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
  console.log('Login: ' + newReq.email);
  const client = new Client(pgConfig.pgConfig);
  await client.connect();
  await client.query('select * from  users where email = $1  limit 1',
    [newReq.email])
    //.then(user => {return response.status(201).json(newUser);})
    .then(user => {
      const row = user.rows[0];
      console.log("result: " + JSON.stringify(row));
      // Check password
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
        .catch(err => { console.log(err); return response.status(500).json(newReq); });

    });
});

// @route GET api/users/get
// @desc get public user properties
// @access Public
router.get("/get/:id", async (req, response) => {
  // Find the user

  await client.query('select * from  users where email = $1  limit 1',
    [newReq.email])
    //.then(user => {return response.status(201).json(newUser);})
    .then(user => {
      var payload = user.rows[0];
      payload.email = null;
      payload.password = null;

      response.json(payload);
    })
    .catch(err => { console.log(err); return response.status(500).json("No user"); });
});
module.exports = router;
