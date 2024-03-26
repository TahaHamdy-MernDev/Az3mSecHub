const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token." });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired." });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { protectedRoute };
