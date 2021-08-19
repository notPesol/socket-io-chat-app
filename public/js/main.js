const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessagesBox = document.querySelector('.chat-messages');
const roomBox = document.getElementById('room-name');
const usersBox = document.getElementById('users');

// get username and room from query string
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// join chatroom
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})

// get message from server
socket.on('message', (message) => {
  outputMessage(message);

  // scroll down
  chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get message text from input
  const msg = chatForm.children.msg.value;

  // emit message to server
  socket.emit('chatMessage', msg);

  // clear input
  clearInput();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>
  `;
  chatMessagesBox.appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
  roomBox.textContent = room;
}

// add username to DOM
function outputUsers(users) {
  // clear first
  usersBox.innerHTML = '';
  // add to usersBox
  for (user of users) {
    const item = document.createElement('li');
    item.textContent = user.username;
    usersBox.appendChild(item);
  }
}

function clearInput() {
  chatForm.children.msg.value = '';
  chatForm.children.msg.focus();
}