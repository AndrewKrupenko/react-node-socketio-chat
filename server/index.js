const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on('connection',socket => {
  socket.on('join_room', data => socket.join(data));
  socket.on('send_message', data => socket.to(data.room).emit('receive_message', data)); // it will emit the message to everyone who is listening (all users in the same chat)
  socket.on('disconnect', () => console.log('User Disconnected', socket.id));
});

server.listen(process.env.SERVER_PORT, () => console.log('SERVER IS RUNNING'));
