class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	match(v2) {
		return this.x === v2.x
		    && this.y === v2.y;
	}

	static add(v2) {
		return new Vector2(this.x + v2.x, this.y + v2.y);
	}
}

class Matrix2 {
	constructor(v2, initialValue) {
		this.initialValue = initialValue;
		this.dimension = v2;

		const row = Array(this.dimension.x).fill(null);
		const col = Array(this.dimension.y).fill(null);

		this.matrix = row.map(x => col)
			.reduce((result, col, x) => {
				const items = col.map((value, y) => {
					return {
						coordinate: new Vector2(x, y),
						value:      this.initialValue
					}
				});

				return result.concat(items);

			}, []);
	}

	get(coordinate) {
		return this.matrix.filter(item => item.coordinate.match(coordinate))
		.map(item => item.value)
		.reduce((result, value) => {

			// TODO: handle multiple results elegantly
			if (result && value) {
				throw new Error(`Unexpected: Multiple results for coordinate [${coordinate.x}, ${coordinate.y}]`);
			}

			return value;

		}, undefined);
	}

	set(coordinate, value) {
		const result = this.matrix.filter(item => {
			return item.coordinate.match(coordinate);
		});

		// TODO: handle multiple results elegantly
		if (result.length > 1) {

			throw new Error(`Unexpected: Multiple results for coordinate [${coordinate.x}, ${coordinate.y}]`);

		} else if (result.length < 1) {

			console.warn(`Could not find coordinate [${coordinate.x}, ${coordinate.y}], value is not set`)

		} else {

			result.map(item => {
				item.value = value;
				return item;
			})
		}
	}

	reset(coordinate) {
		this.set(coordinate, this.initialValue);
	}

	exists(coordinate) {
		return !!this.matrix.filter(item => {
			return item.coordinate.match(coordinate)
		}).reduce((result, item) => result || item, undefined);
	}

	find(value) {
		return this.matrix.filter(item => item.value === value)
			.map(item => item.coordinate);
	}
}

//The maximum is inclusive and the minimum is inclusive
function randomInt(min, max) {
	min = Math.ceil(min);
  	max = Math.floor(max);

  	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { Vector2, Matrix2, randomInt };
