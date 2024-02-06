const Polygon = require('./Polygon.js');


class Circle extends Polygon {
    constructor(pos, radius) {
        super('Circle', pos);
        this.radius = radius;
        this.rotation = 0;
    }

    updateCheckSize() {
        this.checkWidth2 = this.radius;
        this.checkHeight2 = this.radius;
    }
}

module.exports = Circle;