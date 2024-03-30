//const Vector2 = require('./Vector2.js');


// 강체
class RigidBody {
    #_angle; // 각도

    constructor(type, isStatic, shape, mass, pos, angle = 0, restitution = 0.5, friction = 1, damping = 1) {
        this.type = type; // 강체의 종류 (벽, 플레이어 등)
        this.isStatic = isStatic; // 고정된 강체인가?
        this.shape = shape; // 모양
        this.mass = mass; // 질량
        isStatic ? this.invMass = 0 : this.invMass = 1 / mass; // 질량의 역수 (계산에 이용됨)

        this.restitution = restitution; // 복원력 (탄성계수)
        this.friction = friction; // 마찰력
        this.damping = damping; // 저항력 (공기저항 등)

        this.pos = pos; // 중심, 위치
        this.v = new Vector2(); // 속도
        this.a = new Vector2(); // 가속도
        this.f = new Vector2(); // 힘

        this.inertia = this.mass * this.mass * 0.2; // 회전 관성
        this.invInertia = 1 / this.inertia // 회전관성의 역수 (계산에 이용됨);
        this.angle = angle; // 각도
        this.angV = 0; // angular velocity. 각속도
        this.angA = 0; // 각가속도
        this.t = 0; // 토크
    }

    get angle() {
        return this.#_angle;
    }

    set angle(value) {
        this.#_angle = value;
        this.shape.updateCheckSize(this.#_angle); // 각도 변경시 자동으로 사전 검사 크기 재조정
    }


    // 충돌 감지와 보정, 모든 벡터량은 rigidBody1 기준으로
    static checkCollision(fps, rigidBody1, rigidBody2) {
        // 사전 충돌 검사
        if ((Math.max((rigidBody2.pos.x - rigidBody2.shape.checkLeft) - (rigidBody1.pos.x + rigidBody1.shape.checkRight), (rigidBody1.pos.x - rigidBody1.shape.checkLeft) - (rigidBody2.pos.x + rigidBody2.shape.checkRight)) >= 0) || (Math.max((rigidBody2.pos.y - rigidBody2.shape.checkDown) - (rigidBody1.pos.y + rigidBody1.shape.checkUp), (rigidBody1.pos.y - rigidBody1.shape.checkDown) - (rigidBody2.pos.y + rigidBody2.shape.checkUp)) >= 0)) return;

        let normal; // 접촉면의 법선벡터
        let penetration = 0; // 침투(충돌) 정도
        let contactPoints = []; // 접촉점들 (토크 계산시 필요)
        let relativePos = rigidBody2.pos.minus(rigidBody1.pos); // 거리 차

        // 정확한 충돌 검사
        if (rigidBody1.shape.type === 'Circle' && rigidBody2.shape.type === 'Circle') {
            const circle1 = rigidBody1;
            const circle2 = rigidBody2;

            penetration = (circle1.shape.radius + circle2.shape.radius) - Math.abs(relativePos.magnitude); // 충돌 정도

            if (penetration <= 0) return; // 충돌안함
            
            normal = relativePos.normalize(); // 접촉면의 법선벡터

        } else if ((rigidBody1.shape.type === 'Circle' && rigidBody2.shape.type === 'Convex') || (rigidBody1.shape.type === 'Convex' && rigidBody2.shape.type === 'Circle')) {
            const circle = rigidBody1;
            const obb = rigidBody2;
            // 나중에

        } else if (rigidBody1.shape.type === 'Convex' && rigidBody2.shape.type === 'Convex') {
            const normals = [...rigidBody1.shape.getNormals(), ...rigidBody2.shape.getNormals()];

            for (let checkNormal of normals) {
                let [left1, right1] = rigidBody1.shape.getProjections(checkNormal);
                let [left2, right2] = rigidBody2.shape.getProjections(checkNormal);
                let pos1 = checkNormal.dot(rigidBody1.pos);
                let pos2 = checkNormal.dot(rigidBody2.pos);
                left1 = pos1 - left1; // rigidBody 중심기준인 좌표를 월드맵 절대좌표로 변환
                right1 = pos1 + right1;
                left2 = pos2 - left2;
                right2 = pos2 + right2;
                if ((left2 >= right1) || (left1 >= right2)) return; // 충돌안함
                let r = Math.min(right1 - left2, right2 - left1);
                if (penetration === 0 || penetration > r) {
                    penetration = r;
                    normal = checkNormal;
                }
            }

            if (normal.dot(relativePos) < 0) // 기본적으로, 법선벡터와 강체1 기준 좌표차의 내적이 반대방향이니 이 조건은 법선벡터가 강체2 꺼라는 걸 의미함.
                normal = normal.multiply(-1); // 하지만, 강체 구분 외에 평행한 법선벡터들의 방향 구분의 역할도 수행해서 이걸로 온전한 강체 구분은 불가능함.


            RigidBody.correctionCollision(rigidBody1, rigidBody2, normal, penetration) // 충돌 보정. 접촉점을 찾기 전에 보정을 해야 정확해짐.

            // 접촉점들 찾기. 각 강체에서 법선벡터의 변에 가장 가까운 점들을 찾고, 수직으로 돌려 각 양 끝점(충돌하지 않은 꼭짓점)을 제거함.
            // 강체의 무게중심(위치)가 강체 안에 존재해야 함.
            let contactPoints1 = [];
            for (let point of rigidBody1.shape.rotationedPoints) {
                let maxDot = contactPoints1.length ? normal.dot(contactPoints1[0]):-1;
                let dot = normal.dot(point);
                if (Math.abs(maxDot - dot) < 0.001) contactPoints1.push(point); // 회전시 소수점 오차때문에 이렇게 비교해야 함.
                else if (maxDot < dot) contactPoints1 = [point];
            }
            let contactPoints2 = [];
            for (let point of rigidBody2.shape.rotationedPoints) {
                let minDot = contactPoints2.length ? normal.dot(contactPoints2[0]):1;
                let dot = normal.dot(point);
                if (Math.abs(minDot - dot) < 0.001) contactPoints2.push(point); // 회전시 소수점 오차때문에 이렇게 비교해야 함.
                else if (minDot > dot) contactPoints2 = [point];
            }
            contactPoints1 = contactPoints1.map(e => rigidBody1.pos.plus(e));
            contactPoints2 = contactPoints2.map(e => rigidBody2.pos.plus(e));

            // 수직으로 돌려 양 끝점 제거 (수직 단위 벡터에 내적)
            // 강체의 꼭짓점이 변 위에 놓여있으면 안됨. (그럼 위 감지 코드에서 contactPoints의 길이가 3이 넘어버려서 문제가 발생함.)
            let checkNormal = new Vector2(-normal.y, normal.x);
            let min1 = 0, min2 = 0, max1 = 0, max2 = 0;
            if (contactPoints1.length === 2)
                if (checkNormal.dot(contactPoints1[0]) > checkNormal.dot(contactPoints1[1])) min1 = 1;
            if (contactPoints2.length === 2)
                if (checkNormal.dot(contactPoints2[0]) > checkNormal.dot(contactPoints2[1])) min2 = 1;
            
            if (checkNormal.dot(contactPoints1[min1]) > checkNormal.dot(contactPoints2[min2])) contactPoints2.splice(min2, 1);
            else contactPoints1.splice(min1, 1);

            if (contactPoints1.length === 2)
                if (checkNormal.dot(contactPoints1[0]) < checkNormal.dot(contactPoints1[1])) max1 = 1;
            if (contactPoints2.length === 2)
                if (checkNormal.dot(contactPoints2[0]) < checkNormal.dot(contactPoints2[1])) max2 = 1;
            if (checkNormal.dot(contactPoints1[max1]) < checkNormal.dot(contactPoints2[max2])) contactPoints2.splice(max2, 1);
            else contactPoints1.splice(max1, 1);

            contactPoints = [...contactPoints1, ...contactPoints2];
            rigidBody1.shape.contacts = contactPoints1;
            rigidBody2.shape.contacts = contactPoints2;


            // 잘못된 강좌가 코드를 망친 예 ㅠㅠ
            // 이 방법은 모든 변의 법선벡터를 통하여 점이 다른 도형안에 들어가있는지 확인하는거지, 법선벡터에 투영된 거리차이로 감지하는게 아님.
            // 이 방식은 SAT와는 다름! 완전히 달라서 일부경우 충돌감지가 안됨. 즉, 처음에 했던 SAT방식이 더 나음...
            // 이렇게하면 예각 삼각형끼리 닿았을때 변과 변의 충돌을 감지할 수가 없기 때문에 감지가 불가능함.
            // 이런강좌를 왜 했는지 의문이고, 자신도 어떻게 해결했는지 모르는게 당연함.
            // 2024.03.12 내가 강좌글을 뛰어넘은 순간
            /**
            for (let i = 0; i < points1.length; i++) {
                let point1 = rigidBody1.pos.plus(points1[i]);

                isCollide = true;
                for (let j = 0; j < points2.length; j++) {
                    let point2 = rigidBody2.pos.plus(points2[j]);
                    let r = normals2[j].dot(point1.minus(point2)) // 침투정도
                    if (r >= 0) {
                        isCollide = false;
                        break;
                    }
                    if (penetration === undefined || penetration > -r) {
                        penetration = -r; // 가장 얕은 침투 거리
                        normal = normals2[j];
                    }
                }

                if (isCollide) {
                    let temp = rigidBody1;
                    rigidBody1 = rigidBody2;
                    rigidBody2 = temp;
                    break;
                }
            }*/
            
        }

        RigidBody.resolveCollision(rigidBody1, rigidBody2, normal, contactPoints, fps); // 충돌 해결


        /*
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

    // 충돌 보정
    static correctionCollision(rigidBody1, rigidBody2, normal, penetration) {
        let distance = normal.multiply(penetration); // 총 보정 거리

        if (rigidBody1.isStatic) rigidBody2.pos = rigidBody2.pos.plus(distance);
        else if (rigidBody2.isStatic) rigidBody1.pos = rigidBody1.pos.minus(distance);
        else {
            rigidBody1.pos = rigidBody1.pos.minus(distance.multiply(rigidBody2.mass / (rigidBody1.mass + rigidBody2.mass))); // 질량을 이용해 조금 더 정확한 보정
            rigidBody2.pos = rigidBody2.pos.plus(distance.multiply(rigidBody1.mass / (rigidBody1.mass + rigidBody2.mass)));
        }
    }

    // 충돌 해결
    static resolveCollision(rigidBody1, rigidBody2, normal, contactPoints, fps) {
        const e = Math.min(rigidBody1.restitution, rigidBody2.restitution);
        const contacts1 = [], contacts2 = [];
        const impulses = [];
        for (let i = 0; i < contactPoints.length; i++) {
            contacts1.push(contactPoints[i].minus(rigidBody1.pos)); // 접촉점에 대해 각 강체를 원점으로 한 벡터
            contacts2.push(contactPoints[i].minus(rigidBody2.pos));
            let normal1 = new Vector2(-contacts1[i].y, contacts1[i].x); // 접촉점 벡터의 수직 벡터 (각속도니까)
            let normal2 = new Vector2(-contacts2[i].y, contacts2[i].x);
            let angV1 = normal1.multiply(rigidBody1.angV); // 수직 벡터에 속도를 곱함
            let angV2 = normal2.multiply(rigidBody2.angV);
            let relativeV = normal.dot(rigidBody2.v.plus(angV2).minus(rigidBody1.v.plus(angV1))); // 각 접촉점의 법선벡터 기준 속도 차
            if (relativeV > 0) continue; // 접촉점이 서로 멀어지고 있는가?

            let f1 = normal.dot(normal1);
            let f2 = normal.dot(normal2);
            let j = -(1 + e) * relativeV;
            j /= rigidBody1.invMass + rigidBody2.invMass + f1 * f1 * rigidBody1.invInertia + f2 * f2 * rigidBody2.invInertia;
            j /= contactPoints.length;
            impulses.push(normal.multiply(j));
        }

        for (let i = 0; i < impulses.length; i++) {
            rigidBody1.f = rigidBody1.f.minus(impulses[i].multiply(fps));
            rigidBody1.t -= contacts1[i].cross(impulses[i]) * fps;
            rigidBody2.f = rigidBody2.f.plus(impulses[i].multiply(fps));
            rigidBody2.t += contacts2[i].cross(impulses[i]) * fps;
        }
    }
}

//exports = RigidBody;