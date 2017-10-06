const express = require('express');
const Rx = require('rxjs/Rx');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const settings = require('./settings.json');
const { GridGame, directionToVector2 } = require('./game.js');

const currentGame = new GridGame(settings);

const port = process.env.PORT || 3000;

const app = express();
const httpServer = http.Server(app);
const socketServer = socketIo(httpServer);

const connections = Rx.Observable.fromEvent(socketServer, 'connection');

const newPlayers = connections.do(socket => {
	socket.join('game');
});

const moveEvents = newPlayers.flatMap(socket => {
	return Rx.Observable.fromEvent(socket, 'move', (direction) => [socket, direction])
});

const disconnectEvents = newPlayers.flatMap(socket => {
	return Rx.Observable.fromEvent(socket, 'disconnect', () => socket)
});

newPlayers.subscribe(socket => {
	currentGame.addPlayer(socket.id);
    socket.emit('connected', currentGame);
    socket.to('game').emit('update', currentGame);
});

moveEvents.subscribe(([socket, direction]) => {
	currentGame.movePlayer(socket.id, directionToVector2(direction));
	socket.in('game').emit('update', currentGame);
});

disconnectEvents.subscribe(socket => {
	currentGame.removePlayer(socket.id);

	socket.to('game').emit('update', currentGame);
});

app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/Rx.js', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'node_modules/rxjs/bundles', 'Rx.min.js'));
});

httpServer.listen(port, () => console.log(`listening on http://localhost:${port}/`));
