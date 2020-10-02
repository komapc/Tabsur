const jwt = require('jsonwebtoken');
const keys = require("../config/keys.js");

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(`token: ${token}`);
        jwt.verify(token, keys.secretOrKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            //req.user = user;
            console.log(JSON.stringify(user));
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;