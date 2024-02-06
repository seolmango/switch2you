const Vector2 = require('./Polygons/Vector2.js');
const OBB = require('./Polygons/OBB.js');
const Circle = require('./Polygons/Circle.js');


class Map2d {
    static #_Id = 1;
    static #_Instances = {};
    #_id;

    static get Id() {
        return Map2d.#_Id;
    }

    static get Instances() {
        return Map2d.#_Instances;
    }

    constructor() {
        // Map2d 객체 기초 설정
        this.#_id = Map2d.#_Id++;
        Map2d.#_Instances[this.id] = this;

        this.createdTime = Date.now();
        this.polygons = [];

        //this.polygons.push(new OBB(new Vector2(430, 250), 40, 20));
        this.polygons.push(new Circle(new Vector2(2000, 1000), 80));
        this.polygons.push(new Circle(new Vector2(2500, 1000), 400));
    }

    get id() {
        return this.#_id;
    }

    delete() {
        delete Map2d.#_Instances[this.id];
    }

    update() {
        // 충돌 확인
        /**
        for (let i = 0; i < this.polygons.length - 1; i++)
            for (let j = i + 1; j < this.polygons.length; j++)
                this.polygons[i].collisionCheck(this.polygons[j]);
        */

        // 이동
        const friction = 10; // 마찰력
        for (let polygon of this.polygons) {
            if (polygon.velocity.magnitude > friction) polygon.velocity = polygon.velocity.minus(polygon.velocity.normalize().multiply(friction)); // 마찰력 상쇄
            else polygon.velocity.set(0, 0);
            polygon.pos = polygon.pos.plus(polygon.velocity); // 속도만큼 이동
            if (polygon.radius === 80) console.log(polygon.velocity);
        }
    }
}

module.exports = Map2d;