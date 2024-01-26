const Polygon = require('./server/Polygons/Polygon.js');

class OBB extends Polygon {
    constructor(center, width, height, rotation = 0) {
        super();
        this.center = center;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }

    projection(angle) {
        
    }
}