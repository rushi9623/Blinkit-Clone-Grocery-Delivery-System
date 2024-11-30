const jwt = require('jsonwebtoken');  // Add this line to import jwt

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "Access denied, no token provided" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user = decoded; // Decoded token contains user ID and other details
            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports = auth;
