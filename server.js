const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');

const users = require("./routes/api/users");
const meals = require("./routes/api/meals");
const follow = require("./routes/api/follow");
const attends = require("./routes/api/attends");
const notifications = require("./routes/api/notifications");
const app = express();

app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Routes
app.use("/api/users", users);
app.use("/api/meals", meals);
app.use("/api/attends", attends);
app.use("/api/follow", follow);
app.use("/api/notifications", notifications);


//serve static assets in production
console.log("server.js, env = " + process.env.NODE_ENV);
if (process.env.NODE_ENV != "debug")
{
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	})
     
}
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
