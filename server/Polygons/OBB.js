const Polygon = require('./server/Polygons/Polygon.js');

class OBB extends Polygon {
    constructor(pos1, pos2) {
        super();
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.rotation = 0;
    }

    projection(angle) {
        
    }
}