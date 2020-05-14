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
  const attend = req.body;

  console.log("Attend, request: " + JSON.stringify(attend));
  
  const client = new Client(currentConfig);
  await client.connect();
  const meal_id = attend.meal_id;
  const user_id = attend.user_id;
  const status = attend.status;
  if (isNaN(meal_id) || isNaN(user_id) || isNaN(status))
  {
    return response.status(500).json("Bad input");
  }

  client.query(`
  INSERT INTO attends (meal_id, user_id, status)
    VALUES (${meal_id}, ${user_id}, ${status}) 
    ON CONFLICT (meal_id, user_id) 
    DO UPDATE SET 
    status = ${status} WHERE attends.meal_id=${meal_id} AND attends.user_id = ${user_id}`)
      .then
      (
        client.query(`
        INSERT into notifications (meal_id, user_id, message_text, sender, note_type) 
                VALUES ($1, (select host_id from meals where id=$1), 
                CONCAT  ((select name from users where id=$2), ' wants to join your meal.'),
                0, 5)`,
          [attend.meal_id, attend.user_id])
          .catch(err => { 
            console.log(err); 
            client.end();
            return response.status(500).json("failed to add notification: " + err); 
            })
          .then(answer => 
          { 
            client.end();
            return response.status(201).json(answer.rows); 
          }
        )
      )
      .catch(err => { 
        console.log("Attend error" + err); 
        client.end();
        return response.status(500).json("failed to attend: " + err); 
      });
});

/* UPDATE attend */
router.put('/:id', function(req, res, next) {   
  return response.status(500).json("failed to update - not implemented");
});

/* DELETE attend */
router.delete('/:id', async (req, res, next) => {
  console.log("Attend,  " + currentConfig.user );
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