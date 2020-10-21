import { verify } from 'jsonwebtoken';
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        verify(token, process.env.SECRET_OR_KEY, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(403).json(err);
            }
            req.user = user;
            next();
        });
    } else {
        console.error(err);
        return res.status(401).json(err);
    }
};
export default authenticateJWT;