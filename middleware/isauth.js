const jwt = require("jsonwebtoken");
const JWT_SECRET = 'secretkey'; // Consider using an environment variable

const fetchuser = (req, res, next) => {
    // Get token from header
    const token = req.header("auth-token");

    // Check if token exists
    if (!token) {
        return res.status(401).json({ 
            error: "Access denied. No token provided." 
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        // More specific error handling
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: "Invalid token." 
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: "Token expired." 
            });
        }
        
        return res.status(500).json({ 
            error: "Failed to authenticate token." 
        });
    }
};

module.exports = fetchuser;