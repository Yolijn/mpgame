class Vector2 {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * This method checks if the provided vector values
     * match the vector values of the instance it is called upon
     *
     * @param {Vector2} v2
     * @return {Boolean}
     */
    match(v2) {
        return this.x === v2.x
            && this.y === v2.y;
    }

    /**
     * Returns a new Vector2 with the sum of input Vector2 and addition Vector2
     *
     * @param {Vector2} input
     * @param {Vector2} add
     * @return {Vector2}
     */
    static add(input, add) {
        return new Vector2(input.x + add.x, input.y + add.y);
    }
}

/*
    Create a 2d grid with a with (x) and height (y)
    Each position in the grid has a value
    The intial value is null if not provided
*/
class Matrix2 {
    /**
     * @param {Vector2} v2
     * @param {any?} initialValue
     */
    constructor(v2, initialValue = null) {
        this.initialValue = initialValue;
        this.dimension = v2;

        /*
            Create two arrays
            One with the row length and another with the column length
            fill both explicitely with null for use with map/filter/reduce
        */
        const row = new Array(this.dimension.x).fill(null),
              column = new Array(this.dimension.y).fill(null);

        // Fill each position (x) in the row with a column (y)
        this.matrix = row.map((_empty, x) => {

            // Fill each cell in the column with the coordinate[x,y] and the inital value
            return column.map((_val, y) => {
                return {
                    coordinate: new Vector2(x, y),
                    value:      this.initialValue
                }
            })
        })
        // Reduce the 2d array to an 1d array
        .reduce((result, col) => result.concat(col), []);
    }

    /**
     * Get the value of the cell with matching coordinates in the 1d matrix array
     *
     * @param {Vector2} coordinate
     * @return {any} returns the value of the cell or undefined
     */
    get(coordinate) {

        // Use the Vector2.match method to find the cell(s) with matching coordinates
        return this.matrix.filter(item => item.coordinate.match(coordinate))

            // Use only its value property
            .map(item => item.value)

            // Return the value if one result is found, or undefined if none is found
            // TODO: handle multiple results elegantly
            .reduce((result, value) => {
                if (result && value) {
                    console.war(`Unexpected: Multiple results for coordinate [${coordinate.x}, ${coordinate.y}]`);
                }

                return value;

            }, undefined);
    }

    /**
     * Set the value property of a cell with matching coordinates in the 1d matrix array
     *
     * @param {Vector2} coordinate
     * @param {any} value
     */
    set(coordinate, value) {

        // Use the Vector2.match method to find the cell(s) with matching coordinates
        const result = this.matrix.filter(item => {
            return item.coordinate.match(coordinate);
        });

        // TODO: handle multiple results elegantly
        if (result.length > 1) {

            throw new Error(`Unexpected: Multiple results for coordinate [${coordinate.x}, ${coordinate.y}]`);

        } else if (result.length < 1) {

            console.warn(`Could not find coordinate [${coordinate.x}, ${coordinate.y}], value is not set`)

        } else {
            result[0].value = value;
        }
    }

    /**
     * Use the set property to set the coordinates value to the inital value
     *
     * @param {Vector2} coordinate
     */
    reset(coordinate) {
        this.set(coordinate, this.initialValue);
    }

    /**
     * Filter the array to find cells with matching coordinates
     * Reduce the results
     * Force Boolean with !! and return only true when filter/reduce does produce a result
     *
     * @param {Vector2} coordinate
     * @return {Boolean}
     */
    exists(coordinate) {
        return !!this.matrix.filter(item => {
            return item.coordinate.match(coordinate)
        }).reduce((result, item) => result || item, undefined);
    }

    /**
     * Find all cells with a value matching the input value
     *
     * @param {any} value
     * @return {Array<any>}
     */
    find(value) {
        return this.matrix.filter(item => item.value === value)
            .map(item => item.coordinate);
    }
}

/**
 * Create a random integer between min and max
 * The maximum is inclusive and the minimum is inclusive
 *
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
    This is a module for Storing vector values as such
    Creating a matrix full of vector values
    Other math utilities like creating a random integer between MIN and MAX
 */
module.exports = { Vector2, Matrix2, randomInt };
