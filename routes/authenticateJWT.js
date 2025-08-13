const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, keys.secretOrKey, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(403).json(err);
      }
      req.user = user;
      next();
    });
  } else {
    console.error('wrong authHeader.');
    return res.status(401).json('wrong authHeader.');
  }
};
const tryAuthenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, keys.secretOrKey, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};
module.exports = { authenticateJWT, tryAuthenticateJWT };