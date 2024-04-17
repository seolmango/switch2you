//const Shape = require('./Shape.js');


class Circle extends Shape {
    constructor(radius) {
        super('Circle');
        this.radius = radius;
    }

    getArea() {
        return this.radius * this.radius * Math.PI;
    }

    updateCheckSize(angle) {
        this.checkRight = this.radius;
        this.checkLeft = this.radius;
        this.checkUp = this.radius;
        this.checkDown = this.radius;
    }
}

//module.exports = Circle;