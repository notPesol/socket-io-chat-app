const users = [];

// join user to chat
function joinUser(id, username, room) {
  const user = { id, username, room }

  users.push(user);

  return user;
}

// get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

//  user leav chat
function userLeav(id) {
  const index = users.findIndex(user => (
    user.id === id
  ));

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// get room user
function getRoomUsers(room) {
  return users.filter(user => (
    user.room === room
  ));
}

module.exports = {
  joinUser,
  getCurrentUser,
  userLeav,
  getRoomUsers
}