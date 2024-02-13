const Vector2 = require('./Physics/Vector2.js');
const RigidBody = require('./Physics/RigidBody.js');
const Circle = require('./Physics/Circle.js');
const OBB = require('./Physics/OBB.js');


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
        this.rigidBodys = [];

        // test
        this.rigidBodys.push(new RigidBody(new Circle(80), new Vector2(2000, 1000)));
        this.rigidBodys.push(new RigidBody(new Circle(400), new Vector2(2500, 1000)));
    }

    get id() {
        return this.#_id;
    }

    delete() {
        delete Map2d.#_Instances[this.id];
    }

    update(fps) {
        const dt = 1 / fps;

        // 플레이어 행동에 따른 외부 힘 적용
        // ~~어쩌구 저쩌구

        // 이동
        const frictionCoef = 5; // 지면의 마찰계수
        for (let rigidBody of this.rigidBodys) {
            if (rigidBody.v.magnitude > friction) polygon.velocity = polygon.velocity.minus(polygon.velocity.normalize().multiply(friction)); // 마찰력 상쇄
            else rigidBody.v.set(0, 0);
            polygon.pos = polygon.pos.plus(polygon.velocity); // 속도만큼 이동
        }

        // 충돌 확인과 알짜힘 계산
        for (const polygon of polygons) polygon.netForce = new Vector2(); // 알짜힘 초기화
        for (let i = 0; i < this.polygons.length - 1; i++) // 알짜힘 계산
            for (let j = i + 1; j < this.polygons.length; j++)
                this.polygons[i].collisionCheck(this.polygons[j]);

        // 보정과 반응
        for (const polygon of polygons) { // 알짜힘 적용(보정) 및 초기화
            polygon.
            polygon.netForce = new Vector2();
        }
    }
}

module.exports = Map2d;