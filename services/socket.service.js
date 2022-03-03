const logger = require('./logger.service');

var gIo = null;

function connectSockets(http, session) {
  gIo = require('socket.io')(http, { cors: { origin: '*', }, });
  gIo.on('connection', socket => {
    console.log('New socket', socket.id);
    socket.on('disconnect', socket => {
      console.log('Someone disconnected');
    });
    // Book
    // Joining a room
    socket.on('join-book', bookId => {
      if (socket.myBookId === bookId) return;
      if (socket.myBookId) {
        socket.leave(socket.myBookId);
      }
      socket.join(bookId);
      socket.myBookId = bookId;
    });
    // Update changes
    socket.on('book-change', updatedBook => {
      console.log('Emitting book change');
      // emits to all sockets:
      // gIo.emit('chat addMsg', msg)
      // emits only to sockets in the same room
      // gIo.to(socket.myTopic).emit('chat addMsg', msg)
      // using brodcast to send to all sockets BUT not the current socket
      socket.broadcast.to(socket.myBookId).emit('updated-book', updatedBook);
    });
  });
}

function emitTo({ type, data, label }) {
  if (label) gIo.to('watching:' + label).emit(type, data);
  else gIo.emit(type, data);
}

async function emitToUser({ type, data, userId }) {
  logger.debug('Emiting to user socket: ' + userId);
  const socket = await _getUserSocket(userId);
  if (socket) socket.emit(type, data);
  else {
    console.log('User socket not found');
    _printSockets();
  }
}

// Send to all sockets BUT not the current socket
async function broadcast({ type, data, room = null, userId }) {
  console.log('BROADCASTING', JSON.stringify(arguments));
  const excludedSocket = await _getUserSocket(userId);
  if (!excludedSocket) {
    logger.debug('Shouldnt happen, socket not found');
    _printSockets();
    return;
  }
  logger.debug('broadcast to all but user: ', userId);
  if (room) {
    excludedSocket.broadcast.to(room).emit(type, data);
  } else {
    excludedSocket.broadcast.emit(type, data);
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets();
  const socket = sockets.find(s => s.userId == userId);
  return socket;
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets();
  return sockets;
}

async function _printSockets() {
  const sockets = await _getAllSockets();
  console.log(`Sockets: (count: ${sockets.length}):`);
  sockets.forEach(_printSocket);
}
function _printSocket(socket) {
  console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`);
}

module.exports = {
  connectSockets,
  emitTo,
  emitToUser,
  broadcast,
};
