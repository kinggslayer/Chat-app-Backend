const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectToMongo = require("./db");
const Message = require("./models/Message");
const directMessageHandlers = require('./socket/directMessageHandlers');
const groupHandlers = require('./socket/groupHandlers');

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
const groupRoutes = require('./routes/group');

app.use("/api/auth", userRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/messages", chatRoutes);
app.use("/api", passwordRoutes);
app.use('/api', groupRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});



io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Initialize handlers
  directMessageHandlers(io, socket);
  groupHandlers(io, socket);

  // Join user to their personal room for direct messages
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  }

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});



// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
