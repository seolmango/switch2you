const Polygon = require('./server/Polygons/Polygon.js');

class Circle extends Polygon {
    constructor(pos, radius) {
        super();
        this.pos = pos;
        this.radius = radius;
    }

    projection(angle) {
        return this.radius;
    }
}