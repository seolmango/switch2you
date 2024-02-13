const Shape = require('./Shape.js');


class Circle extends Shape {
    constructor(radius) {
        super('Circle');
        this.radius = radius;
    }

    updateCheckSize(rotation) {
        this.checkWidth2 = this.radius;
        this.checkHeight2 = this.radius;
    }
}

module.exports = Circle;