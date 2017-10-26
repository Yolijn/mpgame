const Rx = require('rxjs/Rx'),
      express = require('express'),
      http = require('http'),
      path = require('path'),
      settings = require('./settings.json'),
      socketIo = require('socket.io'),
      { GridGame } = require('./game.js');

const app = express(),
      currentGame = new GridGame(settings),
      httpServer = http.Server(app),
      port = process.env.PORT || 3000,
      socketServer = socketIo(httpServer);

// Listen for connections on the http server and create a socket for each connection
const connections = Rx.Observable.fromEvent(socketServer, 'connection');

// Create an observable for all connections and let each connection join the 'game' room
// Use share to multicast for eventStreams based on these sockets
const newPlayers = connections.do(socket => {
    // In the future we'll be able to split groups of connections into multiple rooms
    socket.join('game');

     // Let the connected socket know it is now connected by sending it the 'connected' event
    socket.emit('connected', settings);
}).share();

// Create an observable for all move events fired on a client socket connection
const moveEvents = newPlayers.flatMap(socket => {
    return Rx.Observable.fromEvent(socket, 'move', (direction) => [socket, direction])
});

// Create an observable for all disconnect events fired by a socket connection
const disconnectEvents = newPlayers.flatMap(socket => {
    return Rx.Observable.fromEvent(socket, 'disconnect', () => socket)
});

// Send current game status to all players in a room
const sendUpdateTo = (room) => {
    socketServer.in(room).emit('update', currentGame);
}

// For each socket connection in the newPlayers observable
newPlayers.subscribe(socket => {

    // Add player with the unique socket id to the game
    currentGame.addPlayer(socket.id);

    //Send the new player and all other players in the game room the most recent game
    sendUpdateTo('game');
});

// When a move event is emitted
moveEvents.subscribe(([socket, direction]) => {

    // Move the player with the socket.id send with the move event
    currentGame.movePlayer(socket.id, direction);

    //Send the new player and all other players in the game room the most recent game
    sendUpdateTo('game');
});

// When a disconnected event is emitted
disconnectEvents.subscribe(socket => {

    // Remove the player with the socket.id send with the disconnect event
    currentGame.removePlayer(socket.id);

    //Send the new player and all other players in the game room the most recent game
    sendUpdateTo('game');
});

// Make all files in the public folder available at localhost:PORT/...
app.use(express.static(path.resolve(__dirname, 'public')));

// Make the rxjs file available at localhost:PORT/Rx.js
app.use('/Rx.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'node_modules/rxjs/bundles', 'Rx.min.js'));
});

/* eslint no-console: "off" */
httpServer.listen(port, () => console.log(`listening on http://localhost:${port}/`));
