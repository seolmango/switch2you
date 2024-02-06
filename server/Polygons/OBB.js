const Vector2 = require('./Vector2.js');
const Polygon = require('./Polygon.js');


class OBB extends Polygon {
    constructor(pos, width2, height2, rotation = 0) {
        super('OBB', pos);
        this.width2 = width2; // 절반
        this.height2 = height2; // 절반
        this.rotation = rotation;
    }

    get unitVector() {
        return [new Vector2(Math.cos(this.rotation), Math.sin(this.rotation)), new Vector2(-Math.sin(this.rotation), Math.cos(this.rotation))]
    }

    updateCheckSize() {
        const axisVector = new Vector2(Math.abs(Math.cos(this.rotation)) * this.width2, Math.abs(Math.sin(this.rotation)) * this.width2);
        const plusVector = new Vector2(-Math.abs(Math.sin(this.rotation)) * this.height2, Math.abs(Math.cos(this.rotation)) * this.height2);
        this.checkWidth2 = axisVector.minus(plusVector).x;
        this.checkHeight2 = axisVector.plus(plusVector).y;
    }

    projection(unitVector) {
        const widthVector2 = new Vector2(Math.cos(this.rotation) * this.width2, Math.sin(this.rotation) * this.width2);
        const heightVector2 = new Vector2(-Math.sin(this.rotation) * this.height2, Math.cos(this.rotation) * this.height2);
        return Math.abs(widthVector2.innerProduct(unitVector)) + Math.abs(heightVector2.innerProduct(unitVector));
    }
}

module.exports = OBB;