//const Vector2 = require('./Vector2.js');


// 강체
class RigidBody {
    #_angle; // 각도

    constructor(type, isStatic, shape, mass, pos, angle = 0, restitution = 0, friction = 1, damping = 1) {
        this.type = type; // 강체의 종류 (벽, 플레이어 등)
        this.isStatic = isStatic; // 고정된 강체인가?
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


    // 충돌 감지와 보정, 모든 검사는 rigidBody1 기준으로
    static checkCollision(fps, rigidBody1, rigidBody2) {
        // 사전 충돌 검사
        if ((Math.abs(rigidBody1.pos.x - rigidBody2.pos.x) >= rigidBody1.shape.checkWidth2 + rigidBody2.shape.checkWidth2) || (Math.abs(rigidBody1.pos.y - rigidBody2.pos.y) >= rigidBody1.shape.checkHeight2 + rigidBody2.shape.checkHeight2)) return;


        let normal; // 접촉면의 법선벡터
        let penetration; // 침투(충돌) 정도
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
            const points1 = rigidBody1.shape.getPoints(rigidBody1.angle);
            const points2 = rigidBody2.shape.getPoints(rigidBody2.angle);
            const normals1 = rigidBody1.shape.getNormals(rigidBody1.angle);
            const normals2 = rigidBody2.shape.getNormals(rigidBody2.angle);

            let isCollide;
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
                    if (penetration === undefined || penetration > Math.abs(r)) {
                        penetration = Math.abs(r); // 가장 얕은 침투 거리
                        normal = normals2[j];
                    }
                }

                if (isCollide) {
                    let temp = rigidBody1;
                    rigidBody1 = rigidBody2;
                    rigidBody2 = temp;
                    break;
                }
            }

            
            if (!isCollide) {
                for (let i = 0; i < points2.length; i++) {
                    let point2 = rigidBody2.pos.plus(points2[i]);
    
                    isCollide = true;
                    for (let j = 0; j < points1.length; j++) {
                        let point1 = rigidBody1.pos.plus(points1[j]);
                        let r = normals1[j].dot(point2.minus(point1)) // 침투정도
                        if (r >= 0) {
                            isCollide = false;
                            break;
                        }
                        if (penetration === undefined || penetration > Math.abs(r)) {
                            penetration = Math.abs(r); // 가장 얕은 침투 거리
                            normal = normals1[j];
                        }
                    }
    
                    if (isCollide) break;
                }
            }

            /**
            const obb1 = rigidBody1;
            const obb2 = rigidBody2;

            // penetration 효율을 위해 다른방식을 재고해볼 필요가 있음.
            const axises = [...obb1.shape.getAxis(obb1.angle), ...obb2.shape.getAxis(obb2.angle)];

            let isCollide = true;
            for (let axis of axises) {
                let w1 = Math.abs(axis.dot(new Vector2(Math.cos(obb1.angle), Math.sin(obb1.angle))) * obb1.shape.width2);
                let h1 = Math.abs(axis.dot(new Vector2(-Math.sin(obb1.angle), Math.cos(obb1.angle))) * obb1.shape.height2);
                let w2 = Math.abs(axis.dot(new Vector2(Math.cos(obb2.angle), Math.sin(obb2.angle))) * obb2.shape.width2);
                let h2 = Math.abs(axis.dot(new Vector2(-Math.sin(obb2.angle), Math.cos(obb2.angle))) * obb2.shape.height2);
                if (Math.abs(axis.dot(relativePos)) >= w1 + h1 + w2 + h2) {
                    isCollide = false;
                    break;
                }
            }*/

            if (!isCollide) return;
        }

        RigidBody.correctionCollision(rigidBody1, rigidBody2, normal, penetration) // 충돌 보정
        RigidBody.resolveCollision(rigidBody1, rigidBody2, normal, fps); // 충돌 해결


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

        if (rigidBody1.isStatic) rigidBody2.correctionPos = rigidBody2.correctionPos.plus(distance);
        else if (rigidBody2.isStatic) rigidBody1.correctionPos = rigidBody1.correctionPos.minus(distance);
        else {
            rigidBody1.correctionPos = rigidBody1.correctionPos.minus(distance.multiply(rigidBody2.mass / (rigidBody1.mass + rigidBody2.mass))); // 질량을 이용해 조금 더 정확한 보정
            rigidBody2.correctionPos = rigidBody2.correctionPos.plus(distance.multiply(rigidBody1.mass / (rigidBody1.mass + rigidBody2.mass)));
        }
    }

    // 충돌 해결
    static resolveCollision(rigidBody1, rigidBody2, normal, fps) {
        const relativeV = rigidBody2.v.minus(rigidBody1.v);
        if (normal.dot(relativeV) > 0) return; // 서로 멀어지고 있는가?
        const e = Math.min(rigidBody1.restitution, rigidBody2.restitution);
        let j = -(1 + e) * normal.dot(relativeV);
        if (rigidBody1.isStatic) j /= rigidBody2.invMass;
        else if (rigidBody2.isStatic) j /= rigidBody1.invMass;
        else j /= rigidBody1.invMass + rigidBody2.invMass;

        const impulse = normal.multiply(j);
        rigidBody1.f = rigidBody1.f.minus(impulse.multiply(fps));
        rigidBody2.f = rigidBody2.f.plus(impulse.multiply(fps));
    }
}

//exports = RigidBody;