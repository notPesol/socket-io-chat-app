const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const socketIO = require('socket.io');
const PORT = 3000 || process.env.PORT;

const server = http.createServer(app);
const io = socketIO(server);

const formatMessage = require('./utils/messages');

const { joinUser, getCurrentUser, userLeav, getRoomUsers } = require('./utils/users');

app.use(express.static(path.join(__dirname, '/public')));


const botName = 'Chat bot';
// run when client connects
io.on('connection', (socket) => {

  socket.on('joinRoom', ({ username, room }) => {
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);

    // welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to chat room'));

    // broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botName, `${user.username} has join the chat`));

    // send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  });

  // listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    // send back to client
    io.emit('message', formatMessage(user.username, msg));
  });


  // run when client disconnects
  socket.on('disconnect', (reason) => {
    const user = userLeav(socket.id);

    if (user) {
      io
        .to(user.room)
        .emit('message', formatMessage(botName, `${user.username} has left the chat`));

      // send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
  });
});


server.listen(PORT, () => {
  console.log('Server running on port:', PORT);
});