const Vector2 = require('./Physics/Vector2.js');
const RigidBody = require('./Physics/RigidBody.js');
const Circle = require('./Physics/Circle.js');
const OBB = require('./Physics/OBB.js');


class Map2d {
    static #_Id = 1;
    static #_Instances = {};
    #_id; #_room;

    static get Id() {
        return Map2d.#_Id;
    }

    static get Instances() {
        return Map2d.#_Instances;
    }

    constructor(room) {
        // Map2d 객체 기초 설정
        this.#_id = Map2d.#_Id++;
        Map2d.#_Instances[this.id] = this;
        this.#_room = room;

        this.createdTime = Date.now();
        this.rigidBodys = [];

        // test
        this.rigidBodys.push(new RigidBody(new Circle(80), 640, new Vector2(2000, 1000)));
        this.rigidBodys.push(new RigidBody(new Circle(400), 16000, new Vector2(2500, 1000)));
    }

    get id() {
        return this.#_id;
    }

    get room() {
        return this.#_room;
    }

    delete() {
        delete Map2d.#_Instances[this.id];
    }

    update(fps) {
        const dt = 1 / fps; // delta time

        // 플레이어 행동에 따른 외부 힘 적용
        // 테스트용. 나중에는 room의 action 이 아니라 직접 player action을 써야함.
        const moveSpeed = 100 * dt;
        const playerR = this.rigidBodys[0];
        if (this.room.actions.move.doing) {
            playerR.pos.x += Math.cos(this.room.actions.move.direction) * moveSpeed;
            playerR.pos.y += Math.sin(this.room.actions.move.direction) * moveSpeed;
        }

        // 이동. semi-implicit euler method.
        const frictionCoef = 0.5; // 지면의 마찰계수
        for (let rigidBody of this.rigidBodys) {
            // 힘으로 가속도 구하고, 그걸로 속도 구하고, 그걸로 위치 이동
            rigidBody.a = rigidBody.f.divide(rigidBody.mass);
            rigidBody.v = rigidBody.v.plus(rigidBody.a.multiply(dt))

            // 마찰력 적용
            const frictionA = rigidBody.f.normalize().multiply((frictionCoef + rigidBody.frictionCoef) * 10); // 마찰력 가속도. 10은 중력가속도. 가속도라 질량은 곱셈 나눗셈이 상쇄돼 필요없음.
            if (rigidBody.v.magnitude > frictionA * dt) // 마찰력 적용
                rigidBody.v = rigidBody.v.minus(frictionA.multiply(dt));
            else
                rigidBody.v.set(0, 0);
            // 공기저항 적용
            rigidBody.v.multiply(1 - 0.1 * dt);

            rigidBody.pos = rigidBody.pos.plus(rigidBody.v.multiply(dt));
        }

        // 힘 초기화
        this.rigidBodys.forEach(rigidBody => rigidBody.f.set(0, 0));

        // 충돌 확인과 알짜힘 계산
        /**
        for (const polygon of polygons) polygon.netForce = new Vector2(); // 알짜힘 초기화
        for (let i = 0; i < this.polygons.length - 1; i++) // 알짜힘 계산
            for (let j = i + 1; j < this.polygons.length; j++)
                this.polygons[i].collisionCheck(this.polygons[j]);

        // 보정과 반응
        for (const polygon of polygons) { // 알짜힘 적용(보정) 및 초기화
            polygon.
            polygon.netForce = new Vector2();
        }*/
    }
}

module.exports = Map2d;