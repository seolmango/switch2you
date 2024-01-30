const Polygon = require('./Polygon.js');

class Circle extends Polygon {
    constructor(pos, radius) {
        super('Circle', pos);
        this.radius = radius;
    }
}

module.exports = Circle;