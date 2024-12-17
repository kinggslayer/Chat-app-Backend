const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectToMongo = require("./db");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port = 5000;

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(express.json());
// app.use(cors());
const allowedOrigins = ['http://localhost:3000']; 

// Use CORS middleware with the 'credentials' option set to true
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies to be sent
}));

// Routes
const userRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const usersRoutes = require("./routes/user");
const passwordRoutes = require("./routes/forgotPassword");

app.use("/api/auth", userRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/messages", chatRoutes);
app.use("/api", passwordRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a specific room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    const { sender, receiver, content, roomId } = data;

    // Save message to the database
    const message = new Message({
      sender,
      receiver,
      content,
      createdAt: new Date()
    });
    await message.save();

    // Broadcast message to the room
    io.to(roomId).emit("receive_message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
