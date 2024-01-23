const Polygon = require('./server/Polygons/Polygon.js');

class Circle extends Polygon {
    constructor(radius) {
        super();
        this.radius = radius;
    }
}