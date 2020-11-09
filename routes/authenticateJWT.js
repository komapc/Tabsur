// TODO: checkAuthenticateJWT()
// TODO:  
const jwt = require('jsonwebtoken');
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET_OR_KEY, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(403).json(err);
            }
            req.user = user;
            next();
        });
    } else {
        console.error("wrong authHeader.");
        return res.status(401).json("wrong authHeader.");
    }
};
const checkAuthenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET_OR_KEY, (err, user) => {
            if (err) {
                next();
            }
            req.user = user;
            next();
        });
    } else {
        next();
    }
}
module.exports=authenticateJWT;