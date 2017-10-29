const { Matrix2, Vector2, randomInt } = require('./math.js');
const RGB = require('./rgb.js');

/* Create a player, with a position an id and color */
class Player {
    /**
     * @constructor Player
     * @param {string} id
     * @param {Vector2} coordinate
     */
	constructor(id, coordinate) {
		this.id = id;
		this.position = coordinate;
		this.color = new RGB();
	}
}

/* Create a GridGame with players, a matrix and set the cell values */
class GridGame {
    /**
     * @constructor GridGame
     * @param {Object} settings
     */
	constructor(settings) {
		const gridDimension = new Vector2(settings.gridWidth, settings.gridHeight);

		this.grid = new Matrix2(gridDimension, settings.initialValue);
		this.players = {};
		this.defaultValue = settings.initialValue;
	}

    /**
     * @this GridGame
     * @param {string} id
     */
	addPlayer(id) {
		const options = this.grid.find(this.defaultValue);
		const randomOption = randomInt(0, options.length);
		const coordinate = options[randomOption];
		const player = new Player(id, coordinate);

		this.players[id] = player;
		this.grid.set(coordinate, player);
	}

    /**
     * @this GridGame
     * @param {string} id
     * @param {Vector2} direction
     */
	movePlayer(id, direction) {
		const oldCoordinate = this.players[id].position;
        const directionV2 = directionToVector2(direction);
		const newCoordinate = Vector2.add(oldCoordinate, directionV2);
        const player = this.players[id];

		if (this.grid.exists(newCoordinate)) {

            this.grid.reset(oldCoordinate);
            player.position = newCoordinate;
            this.grid.set(newCoordinate, player);

		} else {

            // TODO: Do something when new coordinate doesn't exist after adding direction
            console.log(`coordinate ${newCoordinate} doesn't exist`);
		}
	}

    /**
     * @this GridGame
     * @param {string} id
     */
	removePlayer(id) {
		this.grid.reset(this.players[id].position);
		delete this.players[id];
	}
}

/**
 * Transform arrow-key string direction to Vector2
 *
 * @param {Vector2} direction
 * @return {Vector2?}
 */
function directionToVector2(direction) {

	if (direction.toUpperCase() === 'UP') {

        /* Don't move on x & move 1 on y */
		return new Vector2(0, 1);

	} else if (direction.toUpperCase() === 'DOWN') {

        /* Don't move on x & move -1 on y */
		return new Vector2(0, -1);

	} else if (direction.toUpperCase() === 'LEFT') {

        /* Move -1 on x & don't move on y */
		return new Vector2(-1, 0);

	} else if (direction.toUpperCase() === 'RIGHT') {

        /* Move 1 on x & don't move on y */
		return new Vector2(1, 0);

	} else {
        /*
         * Return undefined when the direction is not
         * (case insensitive) UP, DOWN, RIGHT or LEFT
         */
		return;
	}
}

module.exports = { GridGame, directionToVector2 };
