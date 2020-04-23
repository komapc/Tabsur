var express = require('express');
var router = express.Router();
const {Client}=require("pg");
const pgConfig=require("./../dbConfig.js");
let currentConfig = pgConfig.pgConfigProduction;
if (process.env.NODE_ENV === "debug")
{
  currentConfig = pgConfig.pgConfigLocal;
}

/* GET attend by meal */
router.get('/meal/:meal_id', function(req, res, next) {
  attend.find({meal_id:req.params.meal_id}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE attend */
router.post('/:id', async (req, response) => {
  console.log("Attend,  " +currentConfig.user );
  console.log("\n\nRequest: " + JSON.stringify(req.body));
  const attend = req.body;
  const client = new Client(currentConfig);
  await client.connect();
  
  console.log("Attend: connected");
  client.query('INSERT INTO attends ( meal_id, user_id, status)' +
      'VALUES($1, $2, 0)',
      [attend.meal_id, attend.user_id])
  .catch(err => { 
    console.log(err); 
    return response.status(500).json("failed to attend: " + err); 
  })
  .then(answer => { return response.status(201).json(answer); });
});

/* UPDATE attend */
router.put('/:id', function(req, res, next) {   
  return response.status(500).json("failed to update - not implemented");
});

/* DELETE attend */
router.delete('/:id', async (req, res, next) => {
  console.log("Attend,  " +currentConfig.user );
  const attend = req.body;
  const client = new Client(currentConfig);
  await client.connect();
  
  console.log("connected");
  client.query('DELETE FROM attends WHERE ' +
      'meal_id = $1 AND user_id=$2',
      [attend.meal_id, attend.user_id])
  .catch(err => { console.log(err); return response.status(500).json("failed to delete"); })
  .then(answer => { return response.status(201).json(answer); });
});

module.exports = router;