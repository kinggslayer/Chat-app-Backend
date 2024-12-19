const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar:{
    type: String,
    default: "https://img.freepik.com/premium-vector/group-people-with-words-one-with-name-man_1187092-24459.jpg?uid=R177166562&ga=GA1.1.2069800871.1733152729&semt=ais_hybrid"
  }
});

module.exports = mongoose.model('Group', groupSchema);