const express = require("express");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

// Middleware to authenticate the user by verifying the token
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract the token

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey"); // Verify the token
    req.userId = decoded.id; // Attach the user ID to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticateUser;