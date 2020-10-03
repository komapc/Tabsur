const jwt = require('jsonwebtoken');
const keys = require("../config/keys.js");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, keys.secretOrKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        //res.sendStatus(401);
        req.user = null;
        next();
    }
};
module.exports = authenticateJWT;