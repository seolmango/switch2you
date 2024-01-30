const Polygon = require('./Polygon.js');

class Circle extends Polygon {
    constructor(pos, radius) {
        super(pos);
        this.radius = radius;
    }

    get unitVector() {
        return [];
    }

    projection(unitVector) {
        return this.radius;
    }
}

module.exports = Circle;