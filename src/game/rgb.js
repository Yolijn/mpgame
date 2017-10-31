const { randomInt } = require('./math.js');

/**
 * @return {number} a random number between and including 0 and 255
 */
function randomRGBValue() {
    return randomInt(0, 255);
}

/**
 * @param {number} value
 * @return {Boolean}
 */
function isRGBValue(value) {
    return value >= 0 && value <= 255;
}

/*
 * Create an object with separate r, g and b keys
 * Each value is a value between 0 and 255
 */
class RGB {
    /**
     * @constructor RGB
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    constructor(r, g, b) {
        this.r = isRGBValue(r) ? r : randomRGBValue();
        this.g = isRGBValue(g) ? g : randomRGBValue();
        this.b = isRGBValue(b) ? b : randomRGBValue();
    }

    /**
     * @this RGB
     * @return {string} CSS string with this RGB's values
     */
    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}

/*
    This is a module for creating and saving RGB values
    translating them to a string
    creating a random rgb instance
*/
module.exports = RGB;
