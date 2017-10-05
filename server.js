const express = require('express');
const Rx = require('rxjs/Rx');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const port = process.env.PORT || 3000;

const app = express();
const server = http.Server(app);
const sockets = socketIo(server);

const connections = Rx.Observable.fromEvent(sockets, 'connection');
const moveEvents = connections.flatMap(socket => Rx.Observable.fromEvent(socket, 'moveEvent', (direction) => [socket, direction]));
const disconnectEvents = connections.flatMap(socket => Rx.Observable.fromEvent(socket, 'disconnect', () => socket));

connections.subscribe(socket => {
    socket.join('game');

    socket.emit('connected');
    socket.to('game').emit('new player');
})

moveEvents.subscribe(([socket, direction]) => {
	socket.emit('move detected')
	socket.to('game').emit('otherPlayerMoved', [socket.id, direction])
});

disconnectEvents.subscribe(socket => {
	console.log('player disconnected', socket.id);
})

app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/Rx.js', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'node_modules/rxjs/bundles', 'Rx.min.js'));
})

server.listen(port, () => console.log(`listening on http://localhost:${port}/`));
