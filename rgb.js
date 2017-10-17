const { randomInt } = require('./math.js');

function randomRGBValue() {
	return randomInt(0, 255);
}

function isRGBValue(value) {
	return value >= 0 && value <= 255;
}

class RGB {
	constructor(r, g, b) {
		this.r = isRGBValue(r) ? r : randomRGBValue();
		this.g = isRGBValue(g) ? g : randomRGBValue();
		this.b = isRGBValue(b) ? b : randomRGBValue();
	}

	toString() {
		return `rgb(${r}, ${g}, ${b })`;
	}
}

/*
	This is a module for creating and saving RGB values
	translating them to a string
	creating a random rgb instance
*/
module.exports = RGB;
