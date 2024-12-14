const express=require("express");
const app = express()
var cors=require("cors");
const connectToMongo =require("./db");
connectToMongo()
const {Server}= require("socket.io");
const http=require("http");
const server = http.createServer(app);
const io= new Server(server);
const port = 5000
app.use(express.json());
app.use(cors());
const userRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const testRoutes = require('./routes/test');
const usersRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);
app.use('/api/test', testRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/messages', chatRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!')
})
io.on('connection', (socket) => {
  socket.on("message", (message) => {
    io.emit("message", message);
  })
 });
server.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

