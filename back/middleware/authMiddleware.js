const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
       const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Access Denied"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};
const authorize = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        next();
    };
};
module.exports = {
    auth,
    authorize
};