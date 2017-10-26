const { Matrix2, Vector2, randomInt } = require('./math.js');
const RGB = require('./rgb.js');

class Player {
	constructor(id, coordinate) {
		this.id = id;
		this.position = coordinate;
		this.color = new RGB();
	}
}

class GridGame {
	constructor(settings) {
		const gridDimension = new Vector2(settings.gridWidth, settings.gridHeight);
		this.grid = new Matrix2(gridDimension, settings.initialValue);
		this.players = {};
		this.defaultValue = settings.initialValue;
	}

	addPlayer(id) {
		const options = this.grid.find(this.defaultValue);
		const randomOption = randomInt(0, options.length);
		const coordinate = options[randomOption];
		const player = new Player(id, coordinate);

		this.players[id] = player;
		this.grid.set(coordinate, player);
	}

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

	removePlayer(id) {
		this.grid.reset(this.players[id].position);
		delete this.players[id];
	}
}

function directionToVector2(direction) {

	if (direction.toUpperCase() === 'UP') {

		return new Vector2(0, 1);

	} else if (direction.toUpperCase() === 'DOWN') {

		return new Vector2(0, -1);

	} else if (direction.toUpperCase() === 'LEFT') {

		return new Vector2(-1, 0);

	} else if (direction.toUpperCase() === 'RIGHT') {

		return new Vector2(1, 0);

	} else {
		return;
	}
}

module.exports = { GridGame, directionToVector2 };
