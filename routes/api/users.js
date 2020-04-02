const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//const passport = require("passport");
const pgConfig = require("./../dbConfig.js");
const { Client } = require("pg");

let currentConfig = pgConfig.pgConfigProduction;
if (process.env.NODE_ENV === "debug")
{
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
        //input.password = hash;
        client.query('INSERT INTO users (name, email, password, location, address)' +
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
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    console.log("invalid input: " + JSON.stringify(errors));
    return response.status(400).json(errors);
  }
  console.log('Login: ' + newReq.email);
  const client = new Client(currentConfig);
  await client.connect();
  await client.query('SELECT * FROM users WHERE email = $1 OR id = $2 LIMIT 1',
    [newReq.email, newReq.id])
    .then(res => {

      //no record found
      if (res.rows === undefined || res.rows.length == 0) {
        console.log(`error: user doesn't exist`, [newReq.email]); 
        errors.email = "email not found";//emailnotfound
        return response.status(500).json(errors);
      }
      
      // Check password
      const row=res.rows[0];
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
          console.log("bcrypt error:" + err); 
          return response.status(500).json(newReq); })
        .then(() => client.end())

    });
});

// @route GET api/users/get
// @desc get public user properties
// @access Public
router.get("/get/:id", async (req, response) => {
  // Find the user
  const client = new Client(currentConfig);
  await client.connect();
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



// @route GET api/system
// @desc system informaion
// @access Public
router.get("/system", async (req, response) => {
  // Find the user
  const client = new Client(currentConfig);
  await client.connect();
  await client.query('select * from  versions')
    .then(ver => {
      var payload = ver;

      response.json(payload);
    })
    .catch(err => 
    { 
      console.log(err); 
      return response.status(500).json("Failed to get version"); });
});
module.exports = router;
