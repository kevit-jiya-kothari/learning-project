const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. Please log in."
            });
        }

        // Extract the token
        const token = authHeader.split(" ")[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store verified user details for later use
        req.user = decoded;

        // Allow the request to continue
        next();

    } 
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token. Please log in again."
        });
    }
}

module.exports = authMiddleware;