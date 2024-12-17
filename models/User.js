const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required:true,
      default: 'data:image/jpeg;base64,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',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
const User= mongoose.model("User", UserSchema);
User.createIndexes()
module.exports = User