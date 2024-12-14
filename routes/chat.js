const express = require('express');
const mongoose = require("mongoose");
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const authenticateUser = require("../middleware/authenticateUser");
const router = express.Router();

router.get("/api/messages/:userId", authenticateUser, async (req, res) => {
  const { userId } = req.params; // Extract user ID from URL
  const myId = req.userId; // Get logged-in user's ID from the decoded token

  try {
    // Find messages where the sender is the specified user and the receiver is "me"
    const messages = await Message.find({ sender: userId, receiver: myId }).sort({ timestamp: -1 });

    if (!messages.length) {
      return res.status(404).json({ error: "No messages found from this user." });
    }

    res.json(messages); // Return the messages in JSON format
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.post("/", async (req, res) => {
  const { sender, receiver, content } = req.body;


  try {
    // Check if sender and receiver are valid ObjectId strings
    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ error: "Invalid sender or receiver ID." });
    }

    const message = new Message({sender,receiver,content,});

    await message.save();

    res.status(201).json(message); // Return the saved message
  } catch (error) {
    console.error("Error Saving Message:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});



module.exports = router;
