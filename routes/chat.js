const express = require('express');
const mongoose = require("mongoose");
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const router = express.Router();

// GET Route to fetch messages between sender and receiver
router.get("/:receiverId", async (req, res) => {
  const { senderId,receiverId  } = req.body;


  if (!senderId) {
    return res.status(401).json({ error: "Unauthorized access, please log in." });
  }

  try {
    // Ensure sender and receiver IDs are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid sender or receiver ID." });
    }

    // Fetch messages between sender and receiver
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ]
    }).sort({ createdAt: 1 });  // Sort messages by sent time in ascending order

    if (!messages.length) {
      return res.status(404).json({ error: "No messages found." });
    }

    res.json(messages);  // Return the list of messages in JSON format
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// POST Route to send a new message
router.post("/", async (req, res) => {
  const { sender, receiver, content } = req.body;

  try {
    // Check if sender and receiver are valid ObjectId strings
    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ error: "Invalid sender or receiver ID." });
    }

    // Create a new message
    const message = new Message({
      sender,
      receiver,
      content
    });

    // Save the message to the database
    await message.save();

    // Return the saved message as a response
    res.status(201).json(message);
  } catch (error) {
    console.error("Error saving message:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = router;
