const Vector2 = require('./Vector2.js');


// 강체
class RigidBody {
    #_rotation; // 각도

    constructor(shape, mass, pos, rotation = 0) {
        this.shape = shape; // 모양
        this.mass = mass; // 질량
        this.frictionCoef = 0.5; // friction coefficient. 마찰계수

        this.pos = pos; // 중심, 위치
        this.v = new Vector2(); // 속도
        this.a = new Vector2(); // 가속도
        this.f = new Vector2(); // 힘

        this.rotation = rotation; // 각도
        this.angV; // angular velocity. 각속도
        this.angA; // 각가속도
        this.t; // 토크
    }

    delete() {}

    get rotation() {
        return this.#_rotation;
    }

    set rotation(value) {
        this.#_rotation = value;
        this.shape.updateCheckSize(this.#_rotation); // 각도 변경시 자동으로 사전 검사 크기 재조정
    }


    // 충돌 확인과 힘 계산
    collisionCheck(rigidBody) {
        // 사전 충돌 검사
        if ((Math.abs(this.pos.x - rigidBody.pos.x) >= this.checkWidth2 + rigidBody.checkWidth2) || (Math.abs(this.pos.y - rigidBody.pos.y) >= this.checkHeight2 + rigidBody.checkHeight2)) return;

        // type 정렬과 할당
        const types = ['Circle', 'OBB'];
        let check = [this.shape.type, rigidBody.shape.type];
        if (types.indexOf(this.shape.type) > types.indexOf(rigidBody.shape.type)) {
            let temp = check[0]
            check[0] = check[1];
            check[1] = temp;
        }

        // 정확한 충돌 검사
        if (check[0] === 'Circle' && check[1] === 'Circle') {
            const circle1 = this;
            const circle2 = rigidBody;

            const penetration = (circle1.shape.radius + circle2.shape.radius) - Math.abs(circle1.pos.minus(circle2.pos).magnitude); // 충돌 정도
            if (penetration > 0) { // 충돌함
                
            }

        } else if (check[0] === 'Circle' && check[1] === 'OBB') {
            const circle = this;
            const obb = rigidBody;
            // 나중에

        } else if (check[0] === 'OBB' && check[1] === 'OBB') {
            const obb1 = this;
            const obb2 = rigidBody;

            /**
            let check = true;
            const unitVectors = [...this.unitVector, ...polygon.unitVector]; // 투영시켜야 하는 단위 벡터를 모두 받는다.
            for (let unitVector of unitVectors) {
                let line1 = this.projection(unitVector);
                let line2 = polygon.projection(unitVector);
                if (Math.abs(this.pos.minus(polygon.pos).innerProduct(unitVector)) >= line1 + line2) // 직선에 투영시킨게 안닿는지 확인
                    check = false;
            }

            if (check) { // 닿음
                // 닿는 코드 작성
            }
            return check;*/
        }


        /**
        if (this.type === "OBB" && polygon.type === "OBB") {
            let check = true;
            const unitVectors = [...this.unitVector, ...polygon.unitVector]; // 투영시켜야 하는 단위 벡터를 모두 받는다.
            for (let unitVector of unitVectors) {
                let line1 = this.projection(unitVector);
                let line2 = polygon.projection(unitVector);
                if (Math.abs(this.pos.minus(polygon.pos).innerProduct(unitVector)) >= line1 + line2) // 직선에 투영시킨게 안닿는지 확인
                    check = false;
            }

            if (check) { // 닿음
                // 닿는 코드 작성
            }
            return check;

        } else if (this.type === "Circle" && polygon.type === "Circle") {
            const penetration = (this.radius + polygon.radius) - Math.abs(this.pos.minus(polygon.pos).magnitude); // 충돌 정도
            if (penetration > 0) { // 충돌함
                let response = this.pos.minus(polygon.pos).normalize().multiply(penetration * 0.5);
                this.netForce = this.netForce response;
                polygon.netForce = response.multiply(-1);
                //this.velocity = this.velocity.plus(response);
                //polygon.velocity = polygon.velocity.minus(response);
            }

        } else if ((this.type === "Circle" && polygon.type === "OBB") || (polygon.type === "Circle" && this.type === "OBB")) {
            let circle, obb;
            if (this.type === "Circle") {
                circle = this;
                obb = polygon;
            } else {
                circle = polygon;
                obb = this;
            }
            // OBB를 중점으로 좌표계 회전 후, Circle-AABB 감지
            let dpos = circle.pos.minus(obb.pos)
            let drotation = Math.atan2(dpos.y, dpos.x) - obb.rotation;
            dpos = new Vector2(Math.cos(drotation) * dpos.magnitude, Math.sin(drotation) * dpos.magnitude);
            let x, y;
            // Circle-OBB 의 최단점 찾기
            if (dpos.x > obb.pos.x + obb.width2) x = obb.pos.x + obb.width2;
            else if (dpos.x < obb.pos.x - obb.width2) x = obb.pos.x - obb.width2;
            else x = dpos.x;
            if (dpos.y > obb.pos.y + obb.height2) y = obb.pos.y + obb.height2;
            else if (dpos.y < obb.pos.y - obb.height2) y = obb.pos.y - obb.height2;
            else y = dpos.y;
            const check = dpos.minus(new Vector2(x, y)) < circle.radius;
            
            return check;
        }*/
    }

    // 보정
    response() {
        return;
    }
}

module.exports = RigidBody;