//const Vector2 = require('./Vector2.js');


// 강체
class RigidBody {
    #_angle; // 각도

    constructor(shape, mass, pos, angle, restitution = 0, friction = 1, damping = 1) {
        this.shape = shape; // 모양
        this.mass = mass; // 질량
        this.invMass = 1 / mass; // 질량의 역수 (계산에 이용됨)

        this.restitution = restitution; // 복원력 (탄성계수)
        this.friction = friction; // 마찰력
        this.damping = damping; // 저항력 (공기저항 등)

        this.pos = pos; // 중심, 위치
        this.correctionPos = new Vector2(); // 보정 위치값의 합
        this.v = new Vector2(); // 속도
        this.a = new Vector2(); // 가속도
        this.f = new Vector2(); // 힘

        this.rotationalInertia = 1; // 회전 관성
        this.angle = angle; // 각도
        this.angV = 0; // angular velocity. 각속도
        this.angA = 0; // 각가속도
        this.t = 0; // 토크
    }

    delete() {}

    get angle() {
        return this.#_angle;
    }

    set angle(value) {
        this.#_angle = value;
        this.shape.updateCheckSize(this.#_angle); // 각도 변경시 자동으로 사전 검사 크기 재조정
    }


    // 충돌 감지와 보정
    static checkCollision(fps, rigidBody1, rigidBody2) {
        // 사전 충돌 검사
        if ((Math.abs(rigidBody1.pos.x - rigidBody2.pos.x) >= rigidBody1.checkWidth2 + rigidBody2.checkWidth2) || (Math.abs(rigidBody1.pos.y - rigidBody2.pos.y) >= rigidBody1.checkHeight2 + rigidBody2.checkHeight2)) return;

        // type 정렬과 할당
        const types = ['Circle', 'OBB'];
        let check = [rigidBody1.shape.type, rigidBody2.shape.type];
        if (types.indexOf(rigidBody1.shape.type) > types.indexOf(rigidBody2.shape.type)) {
            let temp = check[0]
            check[0] = check[1];
            check[1] = temp;
        }

        // 정확한 충돌 검사
        if (check[0] === 'Circle' && check[1] === 'Circle') {
            const circle1 = rigidBody1;
            const circle2 = rigidBody2;

            const penetration = (circle1.shape.radius + circle2.shape.radius) - Math.abs(circle1.pos.minus(circle2.pos).magnitude); // 충돌 정도
            if (penetration > 0) { // 충돌함
                // 보정
                const normal = circle2.pos.minus(circle1.pos).normalize(); // 법선벡터. circle1이 이동한 방향이라 생각하면 됨.
                let distance = normal.multiply(penetration); // 보정 거리
                circle1.correctionPos = circle1.correctionPos.minus(distance.multiply(circle2.mass / (circle1.mass + circle2.mass))); // 질량을 이용해 조금 더 정확한 보정
                circle2.correctionPos = circle2.correctionPos.plus(distance.multiply(circle1.mass / (circle1.mass + circle2.mass)));

                // 해결
                RigidBody.resolveCollision(fps, circle1, circle2, normal);
            }

        } else if (check[0] === 'Circle' && check[1] === 'OBB') {
            const circle = rigidBody1;
            const obb = rigidBody2;
            // 나중에

        } else if (check[0] === 'OBB' && check[1] === 'OBB') {
            const obb1 = rigidBody1;
            const obb2 = rigidBody2;

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

    // 충돌 해결
    static resolveCollision(fps, rigidBody1, rigidBody2, normal) {
        const relativeV = rigidBody2.v.minus(rigidBody1.v);
        if (normal.dot(relativeV) > 0) return; // 서로 멀어지고 있는가?
        const e = Math.min(rigidBody1.restitution, rigidBody2.restitution);
        let j = -(1 + e) * normal.dot(relativeV);
        j /= rigidBody1.invMass + rigidBody2.invMass;

        const impulse = normal.multiply(j);
        rigidBody1.f = rigidBody1.f.minus(impulse.multiply(fps));
        rigidBody2.f = rigidBody2.f.plus(impulse.multiply(fps));
    }
}

//exports = RigidBody;