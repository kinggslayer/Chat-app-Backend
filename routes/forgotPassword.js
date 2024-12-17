const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const router = express.Router();

// Send Password Reset Email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    console.log(user);
    // Generate a password reset token
    const resetToken = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
    
    // Save the reset token to the user document (optional, if you want to store the token for validation)
    user.token = resetToken;
    await user.save();
    console.log("hi")
    console.log(user);

    // Create a mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Your email
        pass: 'your-email-password'    // Your email password or app password
      }
    });

    // Send the reset email
    const resetLink = `http://yourfrontendurl.com/reset-password/${resetToken}`;
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please click the following link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: 'Failed to send email' });
      } else {
        res.status(200).json({
          success: true,
          message: 'Password reset link sent to your email'
        });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, 'secretkey');

    // Find the user by the ID in the token
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.resetToken = undefined; // Clear the reset token (optional)
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid or expired token' });
  }
});




// Validate the reset token
router.get('/validate-reset-token/:token', async (req, res) => {
  const { token } = req.params;
  try {
    // Verify the reset token
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Optionally, you can check if the token is expired based on the time it was created
    res.json({ success: true, message: 'Token is valid' });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(400).json({ success: false, error: 'Invalid or expired token' });
  }
});

// Handle the reset password request
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, 'secretkey'); // Use your secret key
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Optionally, you can delete the reset token from the database if stored in a Token model

    res.status(200).json({ success: true, message: 'Password successfully reset' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({ success: false, error: 'Failed to reset password' });
  }
});


module.exports = router;
