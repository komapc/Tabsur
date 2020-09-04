const express = require('express');
const AWS = require('aws-sdk');
const keys = require("../../config/keys");
const router = express.Router();

const pgConfig = require("./../dbConfig.js");
let currentConfig = pgConfig.pgConfigProduction;

if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}
const { Client } = require("pg");

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: keys.AWS_KEY,//process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


// @route GET api/system
// @desc system informaion
// @access Public
router.get("/stats/:id", async (req, response) => {
  if (req.params.id != 12345) {
    return response.status(500).json("access denied.");
  }
  // Find the user
  const client = new Client(currentConfig);
  await client.connect();
  client.query(`select id, name,
	(select count (1) from follow where followie=u.id) as followers,
	(select count (1) from follow where follower=u.id) as followies, 
	(select count (1) from meals where host_id=u.id) as meals_hosted,
	(select count (1) from attends where user_id=u.id) as attends
from users as u;
`)
    .then(res => {
      var payload = res.rows;
      console.log("Sending stats");
      response.json(payload);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json("Failed to get stats");
    })
    .finally(() => {
      client.end();
    })
});


// @route GET api/system/
// @desc get a user list
// @access Public
router.get("/users", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get users`);

  const SQLquery = `
  SELECT * from users`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
})


// @route GET api/system/
// @desc get a meal list
// @access Public
router.get("/meals", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get meals`);

  const SQLquery = `
  SELECT meals.id, meals.name, meals.created_at, meals.location, 
    meals.address, meals.guest_count, meals.date, 
    users.name as owner_name, users.id as user_id
  FROM meals INNER JOIN users  ON meals.host_id = users.id`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
})


/////////////////
const  getMealsStats = async ()=>
{
  const client = new Client(currentConfig);
  console.log(`get meal stats`);

  const SQLquery = `
  SELECT TRUNC(extract(epoch FROM now()-created_at)/(60*60*24)) days_before, 
  COUNT (0) as meal_count
  FROM meals  
  GROUP BY TRUNC(extract(epoch from now()-created_at)/(60*60*24))
  ORDER BY TRUNC(extract(epoch from now()-created_at)/(60*60*24))
`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  return client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      return resp.rows;
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
}

const getUsersStat = async ()=>
{
  const client = new Client(currentConfig);
  console.log(`get user stats`);

  const SQLquery = `
  SELECT TRUNC(extract(epoch FROM now()-created_at)/(60*60*24)) days_before, 
  COUNT (0) as user_count
  FROM users  
  GROUP BY TRUNC(extract(epoch from now()-created_at)/(60*60*24))
  ORDER BY TRUNC(extract(epoch from now()-created_at)/(60*60*24))
`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  return client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      return resp.rows;
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
}
// @route GET api/stats/
// @desc get meal/users stats
// @access  
router.get("/stats", async (req, response) => {
  console.log(`get system stats`);
  const stats = await getUsersStat();
  console.log(`Stats: ${stats.length}`);
  const resp=
  {
    userStats: stats
  }

  return response.json(resp);   
})

// @route GET api/stats/
// @desc get meal/users stats
// @access  
router.get("/statsUsers", async (req, response) => {
  console.log(`get system stats`);
  const stats = await getMealsStats();
  console.log(`Stats: ${stats.length}`);
  const resp=
  {
    userStats: stats
  }

  return response.json(resp);
   
})

/////////////////
const getMealsToday = async ()=>
{
  const client = new Client(currentConfig);
  console.log(`get meals today`);

  const SQLquery = `
  SELECT extract(days from (now()-created_at)) AS meals_today FROM meals   
    WHERE extract(days from (now()-created_at)) < 2 `;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  return client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      return resp.rows;
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
}

const countUsers = ()=>
{
  const client = new Client(currentConfig);
  console.log(`count total users.`);

  const SQLquery = `
  SELECT count (0) FROM users`;
  console.log(`SQLquery: [${SQLquery}]`);
  client.connect();

  return client.query(SQLquery)
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      return resp.rows;
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
}



// @route GET api/health/
// @desc get system health status
// @access  
router.get("/health", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get system health`);
  const meals = await getMealsToday();
  var totalUsers = await countUsers();
  totalusers = (totalUsers && totalUsers[0])?totalUsers[0].count:0;
  const mealsToday = (meals && meals[0])?meals[0].meals_today:0;
  console.log(`meals: ${JSON.stringify(mealsToday)}`);
  const resp=
  {
    DB:true,
    server:true,
    mealsCreatedToday: mealsToday,
    users: totalUsers,
    onlineUsers: Math.floor(Math.random() * totalUsers), //FAKE
    activeMeals:12345 //FAKE
  }

  return response.json(resp);
   
})

// @route POST api/system/reset/
// @desc reset the servers
// @access  
router.post("/reset", async (req, response) => {
  //const client = new Client(currentConfig);
  console.log(`Reset request. Do nothing for now.`);
 
  return response.json("reset request received.");
})

// @route DELETE api/system/user/
// @desc delete a user
// @access  
router.delete("/user/:id", async (req, response) => {
  //const client = new Client(currentConfig);
  console.log(`Delete user ${req.params.id}. Do nothing for now.`);
 
  return response.json("Deleting user request received.");
})


const renameUser = (id, newName) =>
{
  const client = new Client(currentConfig);
  console.log(`Renaming user ${id} to ${newName}.`);

  const SQLquery = `
  UPDATE users SET name=$2 WHERE id=$1 RETURNING $2`;
  console.log(`SQLquery: [${SQLquery}]`);
  client.connect();

  return client.query(SQLquery, [id, newName])
    .then(resp => {
      console.log(JSON.stringify(resp.rows));
      return resp.rows;
    })
    .catch(err => {
      console.error(err);
      return err;
    })
    .finally(() => {
      client.end();
    });
}
// @route put api/system/user/
// @desc rename a user
// @access  
router.put("/user", async (req, response) => {
  const id = req.params.id;
  const newname = req.params.name;
  console.log(`rename user ${id} to ${newName}.`);
  const result = await renameUser(id, newName);
  return response.json(result);
})

// @route put api/system/resetPassword/
// @desc reset password for a user
// @access  
router.put("/resetPassword", async (req, response) => {
  const id = req.body.id;
  console.log(`reset password to user ${id} (FAKE).`);
  return response.json("Password reset request received.");
})


// @route get api/system/notifications/
// @desc get data from notificatin table
// @access  
router.get("/notifications", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`get meals today`);

  const SQLquery = `
  SELECT * FROM notifications`;
  console.log(`SQLquery: [${SQLquery}]`);
  await client.connect();

  return client.query(SQLquery)
    .then(resp => {
      //console.log(JSON.stringify(resp.rows));
      console.log("Done.");
      return response.json(resp.rows);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.end();
    });
})


// @route post api/system/mail/
// @desc send a mail
// @access  
router.post("/newsletter", async (req, response) => {
  const client = new Client(currentConfig);
  console.log(`newsletter, text: ${req.body.text}`);

  return response.json("Newsletter will be sent to all users.");
})

// @route post api/system/notification/
// @desc send notification
// @access  
router.post("/notification", async (req, response) => {
  const text = req.body.text;
  const userId = req.body.id;
  console.log(`notification to ${id}, text: ${req.body.text}`);

  return response.json("Notification sent.");
})


// @route post api/system/mail/
// @desc send notification
// @access  
router.post("/mail", async (req, response) => {
  const text = req.body.text;
  const userId = req.body.id;
  console.log(`mail to ${id}, text: ${req.body.text}`);

  return response.json("Notification sent.");
})


// @route get api/system/log/
// @desc show log
// @access  

const readFakeLog = (response) => {
  var fs = require('fs'),
    path = require('path'),
    filePath = "./routes/api/fakeLog.log";

  fs.readFile(filePath, function (err, data) {
    if (!err) {
      console.log('received data: ' + data);
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
    } else {
      console.log(err);
    }
  });
}
router.get("/log", async (req, response) => {
  console.log(`Show fake log.`);
  readFakeLog(response);
  return response;
})

// @route delete api/system/log/
// @desc delete log
// @access  
router.delete("/log", async (req, response) => {
  console.log(`log delete request.`);

  return response.json("Log deleted.");
})


module.exports = router;