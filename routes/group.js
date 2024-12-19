const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const GroupMessage = require('../models/GroupMessage');
const auth = require('../middleware/isauth');


// Get all groups for a user
router.get('/groups/:userId', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.userId })
      .populate('members', 'username avatar')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new group
router.post('/groups', auth, async (req, res) => {
  try {
    const { name, members, createdBy } = req.body;

    const group = new Group({
      name,
      members,
      createdBy
    });

    await group.save();

    // Populate the saved group with member details
    const populatedGroup = await Group.findById(group._id)
      .populate('members', 'username avatar')
      .populate('createdBy', 'username');

    // Emit group creation event to all members
    const io = req.app.get('io');
    members.forEach(memberId => {
      io.to(memberId.toString()).emit('group_update', populatedGroup);
    });

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get group messages
router.get('/groups/:groupId/messages', auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await GroupMessage.find({ groupId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add member to group
router.post('/groups/:groupId/members', auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    group.members.push(userId);
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'username avatar')
      .populate('createdBy', 'username');

    // Notify all group members about the new member
    const io = req.app.get('io');
    group.members.forEach(memberId => {
      io.to(memberId.toString()).emit('group_update', updatedGroup);
    });

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove member from group
router.delete('/groups/:groupId/members/:userId', auth, async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.members = group.members.filter(
      member => member.toString() !== userId
    );
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'username avatar')
      .populate('createdBy', 'username');

    // Notify remaining members about the removal
    const io = req.app.get('io');
    group.members.forEach(memberId => {
      io.to(memberId.toString()).emit('group_update', updatedGroup);
    });

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;



// module.exports = (io, socket) => {
//   // Join a group chat room
//   socket.on('join_group', async (groupId) => {
//     socket.join(groupId);
//   });

//   // Handle group messages
//   socket.on('send_group_message', async (message) => {
//     try {
//       const { groupId, sender, content } = message;

//       // Save message to database
//       const newMessage = new GroupMessage({
//         groupId,
//         sender,
//         content
//       });
//       await newMessage.save();

//       // Get group members
//       const group = await Group.findById(groupId);
//       if (!group) return;

//       // Emit message to all group members
//       io.to(groupId).emit('receive_message', {
//         ...message,
//         _id: newMessage._id,
//         createdAt: newMessage.createdAt
//       });
//     } catch (error) {
//       console.error('Error handling group message:', error);
//     }
//   });

//   // Leave group chat room
//   socket.on('leave_group', (groupId) => {
//     socket.leave(groupId);
//   });
// };



// Socket.IO connection handling
// io.on('connection', (socket) => {
//   // ... existing socket handlers
//   // Add group handlers
//   groupHandlers(io, socket);

//   // Join user to their personal room for direct notifications
//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     socket.join(userId);
//   }
// });