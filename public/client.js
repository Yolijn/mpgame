'use strict';
/*eslint no-undef: "off"*/
/*eslint no-console: "off"*/

function rgbToString(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function Game() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');

    // Make sure the bottom left corner is [0,0] for our gridgame;
    this.ctx.translate(0, this.canvas.height);
    this.ctx.scale(1, -1);
}

Game.prototype.init = function (socket, settings) {

    var keyUpEvents$ = Rx.Observable.fromEvent(document, 'keyup');
    var grid$ = new Rx.Observable.fromEvent(socket, 'update');
    var moveEvent$ = keyUpEvents$.filter(function(event) {
        return /^Arrow(Up|Down|Left|Right)$/.test(event.key);
    });

    // TODO Include Vector2 module which uses es6 module.exports
    this.cellSize = {
        x: this.canvas.width / settings.gridWidth,
        y: this.canvas.height / settings.gridHeight
    };

    moveEvent$.subscribe(function(event) {
        var direction = event.key.replace(/^Arrow/, '');

        socket.emit('move', direction);
    });

    this.grid = grid$.subscribe(this.draw.bind(this));
}

// Works only after Game.init(grid) has run
Game.prototype.draw = function(state) {

    var ctx = this.ctx,
        cellSize = this.cellSize;

    this.active = state.grid.matrix.filter(function(item) {
        return item.value;
    }).map(function(item) {
        return item.value
    });

    this.active.forEach(function(item) {
        ctx.fillStyle = rgbToString(item.color);
        ctx.fillRect(
            item.position.x * cellSize.x,
            item.position.y * cellSize.y,
            cellSize.x,
            cellSize.y
        );
    })
}

/** This function will run after the DOMContentLoaded event is detected */
function init() {
    var socket = io();
    var game = new Game();

    /* ========   Detect socket events   ======== */
    socket.on('connected', function(settings) {
        game.init(socket, settings);
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
