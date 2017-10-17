const express = require('express'),
	  Rx = require('rxjs/Rx'),
	  http = require('http'),
	  socketIo = require('socket.io'),
	  path = require('path'),
	  settings = require('./settings.json'),
	  { GridGame, directionToVector2 } = require('./game.js');

const currentGame = new GridGame(settings),
	  port = process.env.PORT || 3000,
	  app = express(),
	  httpServer = http.Server(app),
	  socketServer = socketIo(httpServer);

// Listen for connections on the http server and create a socket for each connection
const connections = Rx.Observable.fromEvent(socketServer, 'connection');

// Create an observable for all connections and let each connection join the 'game' room
const newPlayers = connections.do(socket => {

    // In the future we'll be able to split groups of connections into multiple rooms
    socket.join('game');
});

// Create an observable for all move events fired on a client socket connection
const moveEvents = newPlayers.flatMap(socket => {
    return Rx.Observable.fromEvent(socket, 'move', (direction) => [socket, direction])
});

// Create an observable for all disconnect events fired by a socket connection
const disconnectEvents = newPlayers.flatMap(socket => {
    return Rx.Observable.fromEvent(socket, 'disconnect', () => socket)
});

// For each socket connection in the newPlayers observable
newPlayers.subscribe(socket => {

    // Add player with the unique socket id to the game
    currentGame.addPlayer(socket.id);

    // Let the connected socket know it is now connected by sending it the 'connected' event
    socket.emit('connected', currentGame);

    // Let all players in the 'game' room know the game is updated and send the new game status
    socket.to('game').emit('update', currentGame);
});

// When a move event is emitted
moveEvents.subscribe(([socket, direction]) => {

    // Move the player with the socket.id send with the move event
    currentGame.movePlayer(socket.id, directionToVector2(direction));

    // Let all players in the 'game' room know the game is updated and send the new game status
    socket.in('game').emit('update', currentGame);
});

// When a disconnected event is emitted
disconnectEvents.subscribe(socket => {

    // Remove the player with the socket.id send with the disconnect event
    currentGame.removePlayer(socket.id);

    // Let all other players in the 'game' room know the game is updated and send the new game status
    socket.to('game').emit('update', currentGame);
});

// Make all files in the public folder available at localhost:PORT/...
app.use(express.static(path.resolve(__dirname, 'public')));

// Make the rxjs file available at localhost:PORT/Rx.js
app.use('/Rx.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'node_modules/rxjs/bundles', 'Rx.min.js'));
});

// eslint no-console: "off"
httpServer.listen(port, () => console.log(`listening on http://localhost:${port}/`));
