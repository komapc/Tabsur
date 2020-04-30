const pgConfig=require("./../dbConfig.js");
let currentConfig = pgConfig.pgConfigProduction;

if (process.env.NODE_ENV === "debug")
{
  currentConfig = pgConfig.pgConfigLocal;
}
const {Client}=require("pg");
const express = require("express");
const router = express.Router();

// @route GET api/follow/get
// @desc get a meal list
// @access Public
router.get("/get_followers/:id", async  (req, response) => 
{
  const client = new Client(currentConfig);
  console.log(`get followers for user ${req.params.id}`);
  const meal = req.body;

  const SQLquery=`SELECT follower FROM follow WHERE followie = ${req.params.id}`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  client.query(SQLquery)
    .then(resp=>{
      response.json(resp.rows);
      client.end();
    })
    .catch(err => { 
      client.end();
      console.log(err); 
      return response.status(500).json(err); });})
 
// @route GET api/meals/get_my
// @desc get a list of meals created by me
// @access Public
router.get("/get_followies/:id", async (req, response) => 
{
  const client = new Client(currentConfig);
  console.log("get followies by user id: " + JSON.stringify(req.params)); 
  if (req.params.id == "undefined")
  {
    client.end();
    console.log("error, empty id");
    response.status(400).json("Error in get followies: empty");
    return; 
  }
  const SQLquery=`SELECT follower FROM follow WHERE followie = ${req.params.id}`;
  await client.connect();
  client.query(SQLquery)
    .then(resp=>{
      response.json(resp.rows);
      client.end();
    })
    .catch(err => { 
      console.log(err); 
      client.end();
      return response.status(500).json(err); });
});

// @route POST api/meals/addMeal
router.post("/follower/:id", async (req, response) => {
  const client = new Client(currentConfig);
  const follower=req.params.id;
  const followie=req.body.followie;
  const status = req.body.status;
  const SQLquery=`
    INSERT INTO follow (follower, followie, status)
    VALUES (${follower}, ${followie}, ${status}) 
    ON CONFLICT (follower, followie) 
    DO UPDATE SET 
    status = ${status} WHERE follow.follower=${follower} AND follow.followie = ${followie}`;
  console.log(JSON.stringify(SQLquery));
  await client.connect();
  client.query(SQLquery)
    .then(resp=>{
      response.json(resp.rows);
      client.end();
    })
    .catch(err => { 
      console.log(err); 
      client.end();
      return response.status(500).json(err); });
});

module.exports = router;
