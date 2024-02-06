const Vector2 = require('./Polygons/Vector2.js');
const OBB = require('./Polygons/OBB.js');
const Circle = require('./Polygons/Circle.js');


class Map2d {
    constructor() {
        this.createdTime = Date.now();
        this.polygons = [];
        this.polygons.push(new OBB(new Vector2(430, 250), 40, 20));
        this.polygons.push(new Circle(new Vector2(400, 225), 50));
    }

    update() {
        // 충돌 확인
        for (let i = 0; i < this.polygons.length - 1; i++)
            for (let j = i + 1; j < this.polygons.length; j++)
                this.polygons[i].collisionCheck(this.polygons[j]);
    }
}

module.exports = Map2d;