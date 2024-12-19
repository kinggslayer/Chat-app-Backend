const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");
const router = express.Router();

router.get("/:receiverId", async (req, res) => {
  const { senderId } = req.query;
  const { receiverId } = req.params;

  if (!senderId) {
    return res.status(401).json({ error: "Unauthorized access, please log in." });
  }

  try {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid sender or receiver ID." });
    }

    // Fetch messages
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    // Send response
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// POST Route to send a new message
router.post("/", async (req, res) => {
  const { sender, receiver, content } = req.body;

  if (!sender || !receiver || !content) {
    return res.status(400).json({ error: "Sender, receiver, and content are required." });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ error: "Invalid sender or receiver ID." });
    }

    // Create a new message
    const message = new Message({
      sender,
      receiver,
      content,
      createdAt: new Date(),
    });

    // Save the message to the database
    await message.save();

    // Emit the message to connected clients using socket.io
    io.to(receiver).emit("newMessage", message);  // Emits to receiver's socket room

    // Return the saved message
    res.status(201).json(message);
  } catch (error) {
    console.error("Error saving message:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = router;
