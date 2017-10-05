'use strict';

/** */
function init() {
	var socket = io();
	var canvas = document.getElementById('game');
	var context = canvas.getContext('2d');

	var keyUpEvents = Rx.Observable.fromEvent(document, 'keyup');
	var arrowKeyEvents = keyUpEvents.filter(function(event) {
		return /^Arrow(Up|Down|Left|Right)$/.test(event.key);
	});

	socket.on('connected', function() {
		console.log('connected');

		arrowKeyEvents.subscribe(function(event) {
			var direction = event.key.replace(/^Arrow/, '');
			socket.emit('moveEvent', direction);
		});
		// draw game
	})

	socket.on('move detected', function () {
		console.log('Move detected');
	})

	socket.on('new player', function() {
		console.log('player connected');
		// add player to canvas
	})

	socket.on('otherPlayerMoved', function(info) {
		console.log('Other player moved');
		// redraw game
	})
}

document.addEventListener('DOMContentLoaded', function (event) {
	init();
});
