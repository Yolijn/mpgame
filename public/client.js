'use strict';
/*eslint no-undef: "off"*/
/*eslint no-console: "off"*/

/**
 * @param {Object<number, number, number>} rgb
 * @return {string}
 */
function rgbToString(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Create an instance of game by getting the right DOM context
 * @constructor
 */
function Game() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');

    // Make sure the bottom left corner is [0,0] for our gridgame;
    this.ctx.translate(0, this.canvas.height);
    this.ctx.scale(1, -1);
}

/**
 * Initialise the game with observables from client and socket events
 * Calculate the size of the cells to use in the canvas
 * Subscribe to grid stream and (re)draw the canvas when a change is emitted
 *
 * @this Game
 * @param {Object} socket
 * @param {Object} settings
 */
Game.prototype.init = function (socket, settings) {
    var keyUpEvents$ = Rx.Observable.fromEvent(document, 'keyup');
    var game$ = new Rx.Observable.fromEvent(socket, 'update');

    /* Filter keyEvents to match only Arrow Up, Down, Left and Right */
    var moveEvent$ = keyUpEvents$.filter(function(event) {
        return /^Arrow(Up|Down|Left|Right)$/.test(event.key);
    });

    var toXY = {
      UP:    [ 0,  1],
      DOWN:  [ 0, -1],
      LEFT:  [-1,  0],
      RIGHT: [ 1,  0]
    }

    // Size of the cells to use in the canvas
    this.cellSize = {
        x: this.canvas.width / settings.gridWidth,
        y: this.canvas.height / settings.gridHeight
    };

    /* For each Arrow key press, emit the socket:move event and send the direction */
    moveEvent$.subscribe(function(event) {
        var direction = event.key.replace(/^Arrow/, '');

        socket.emit('move', toXY[direction]);
    });

    /* Call the game.draw function each time a new game state is pushed */
    game$.subscribe(this.draw.bind(this));
}

/**
 * NB: Works only after Game.init(socket, settings) has run
 *
 * @this Game
 * @param {Object} state
 */
Game.prototype.draw = function(state) {

    /**
     * @this Game
     * @param {Object} player
     */
    function drawPlayer(player) {
        this.ctx.fillStyle = rgbToString(player.color);
        this.ctx.fillRect(
            // left: posX in grid * cellwidth
            player.position.x * this.cellSize.x,

            // bottom: posY in grid * cellHeight
            player.position.y * this.cellSize.y,

            // width: cellWidth
            this.cellSize.x,

            // height: cellHeigth
            this.cellSize.y
        );
    }

    /**
     * @param {Object} item
     * @return {Boolean}
     */
    function hasValue(item) {
        return !!item.value;
    }

    /**
     * @param {Object} item
     * @return {any}
     */
    function getValue(item) {
        return item.value;
    }

    /* filter new grid so only items with value remain and get the values */
    this.active = state.grid.matrix.filter(hasValue).map(getValue);

    /* clear the canvas before drawing to clear moved or removed cell-values */
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /* draw each cell on the canvas */
    this.active.forEach(drawPlayer.bind(this));
}

/**
 * This function will run after the DOMContentLoaded event is detected
 */
function init() {
    /* Create socket connection */
    var socket = io();

    /* Create new game instance */
    var game = new Game();

    /*
     * When the socket emits the connected event, init game
     * with the socket connection and connect event provided game settings
     */
    socket.on('connected', function(settings) {
        game.init(socket, settings);
    });
}

/* Make sure to start after the DOM content is fully loaded */
document.addEventListener('DOMContentLoaded', function () {
    init();
});
