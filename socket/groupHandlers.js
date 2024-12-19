const Group = require('../models/Group');
const GroupMessage = require('../models/GroupMessage');

module.exports = (io, socket) => {
  // Join a group chat room
  socket.on('join_group', async (groupId) => {
    socket.join(groupId);
  });

  // Handle group messages
  socket.on('send_group_message', async (message) => {
    try {
      const { groupId, sender, content } = message;

      // Save message to database
      const newMessage = new GroupMessage({
        groupId,
        sender,
        content
      });
      await newMessage.save();

      // Get group members
      const group = await Group.findById(groupId);
      if (!group) return;

      // Emit message to all group members
      io.to(groupId).emit('receive_message', {
        ...message,
        _id: newMessage._id,
        createdAt: newMessage.createdAt
      });
    } catch (error) {
      console.error('Error handling group message:', error);
    }
  });

  // Leave group chat room
  socket.on('leave_group', (groupId) => {
    socket.leave(groupId);
  });
};