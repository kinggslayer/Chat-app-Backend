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
      default: 'https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
const User= mongoose.model("User", UserSchema);
User.createIndexes()
module.exports = User