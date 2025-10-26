require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // The origin of your frontend app
    methods: ["GET", "POST"]
  }
});

let onlineUsers = {};

const addUser = (userId, socketId) => {
  onlineUsers[userId] = socketId;
};

const removeUser = (socketId) => {
  Object.keys(onlineUsers).forEach(userId => {
    if (onlineUsers[userId] === socketId) {
      delete onlineUsers[userId];
    }
  });
};

const getUserSocket = (userId) => {
  return onlineUsers[userId];
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', Object.keys(onlineUsers));
  });

  socket.on('sendMessage', (message) => {
    const recipientSocket = getUserSocket(message.recipientId);
    if (recipientSocket) {
      io.to(recipientSocket).emit('newMessage', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    removeUser(socket.id);
    io.emit('getUsers', Object.keys(onlineUsers));
  });
});

sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
