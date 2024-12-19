const Message = require('../models/Message');

module.exports = (io, socket) => {
  // Join a specific room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
  });

  // Handle sending direct messages
  socket.on("send_message", async (data) => {
    try {
      const { sender, receiver, content } = data;

      // Save message to the database
      const message = new Message({
        sender,
        receiver,
        content,
        createdAt: new Date()
      });
      await message.save();

      // Broadcast message to the room
      io.to(receiver).emit("receive_message", message);
    } catch (error) {
      console.error('Error handling direct message:', error);
    }
  });
};
