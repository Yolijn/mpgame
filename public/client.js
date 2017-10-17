'use strict';
/*eslint no-undef: "off"*/
/*eslint no-console: "off"*/

function Game() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');

    // Make sure the bottom left corner is [0,0] for our gridgame;
    this.ctx.translate(0, this.canvas.height);
    this.ctx.scale(1, -1);
}

Game.prototype.init = function(grid) {
    this.matrix = grid.matrix;
    this.grid = Rx.Observable.from(this.matrix);

    // TODO Include Vector2 module which uses es6 module.exports
    this.blockSize = {
        x: this.canvas.width / grid.dimension.x,
        y: this.canvas.height / grid.dimension.y
    };
}

// Works only after Game.init(grid) has run
Game.prototype.draw = function() {
    this.active = this.grid.filter(function(item) {
        return item.value;
    })

    this.active.subscribe(function(item) {
        console.log('item', item);
    })
}

Game.prototype.refresh = function(newGrid) {
    this.matrix = newGrid.matrix;
    this.draw();
}

/** This function will run after the DOMContentLoaded event is detected */
function init() {
    var socket = io();
    var keyUpEvents = Rx.Observable.fromEvent(document, 'keyup');
    var arrowKeyEvents = keyUpEvents.filter(function(event) {
        return /^Arrow(Up|Down|Left|Right)$/.test(event.key);
    });

    var game = new Game();

    /* ========   Detect socket events   ======== */
    socket.on('connected', function(currentGame) {
        console.log('connected');

        game.init(currentGame.grid);
        game.draw();

        arrowKeyEvents.subscribe(function(event) {
            var direction = event.key.replace(/^Arrow/, '');
            socket.emit('move', direction);
        });
    })

    socket.on('update', function(currentGame) {
        // redraw game
        console.log('refresh');
        game.refresh(currentGame.grid);
    })

    socket.on('move registered', function () {
        console.log('Move registered');
    })
    /* =========================================== */
}

// Make sure to start after the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    init();
});
