const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true, // Enable automatic `createdAt` and `updatedAt` fields
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
