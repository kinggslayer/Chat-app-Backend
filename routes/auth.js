const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({success: false, error: 'Email is already registered' });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({success: false, error: 'UserName is already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    // Save the user
    await user.save();

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '24h' });

    // Send the response with the token
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
    });
  } catch (err) {
    res.status(400).json({success: false, error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({success: false, error: 'User not found' });

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '24h' });
    res.json({success: true, token, user });
  } catch (err) {
    res.status(400).json({success: false, error: err.message });
  }
});

module.exports = router;
