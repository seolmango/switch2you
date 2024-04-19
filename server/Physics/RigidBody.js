//const Vector2 = require('./Vector2.js');


// 강체
class RigidBody {
    #_angle; // 각도

    // 필수 - shape (구조체가 아닌 객체라, 참조 관리의 편의성을 위해 따로 매개변수로 작성)
    // 선택 - collisionType, pos, angle, restitution, friction, damping, density/mass, area, inertia
    // 항상 각 강체마다 Shape를 여러개 가질 수 있다는 걸 고려하고 필드를 만들어야 함.
    // Shapes가 묶여서 한 물체로 인식되려면, 모양에 대한 정보말고는 가지고 있으면 안됨.
    constructor(shape, setting) {
        this.shape = shape; // 모양

        // 충돌 처리 4종류 (충돌감지를 해야하는건 무조건 World에서 처리. 안해도되면 World에서 처리안하는게 좋음. (최적화))
        // only-collide: 충돌하고 반응 안함. / 풀, 아이템
        // dynamic: 충돌하고 반응 함. / 일반적인 물체
        // static: 충돌하고 반응 함. 반응 시 밀리지 않음. / 벽
        // 그 외 모든 type: 같은 type끼리는 충돌하고 반응 안함. 다른 type과는 충돌하고 반응 함. / 플레이어
        setting.collisionType ? this.collisionType = setting.collisionType : this.collisionType = 'dynamic';
        setting.pos ? this.pos = setting.pos.deepCopy() : this.pos = new Vector2();
        setting.angle ? this.angle = setting.angle : this.angle = 0;
        setting.restitution ? this.restitution = setting.restitution : this.restitution = 0; // 복원력 (탄성계수)
        setting.friction ? this.friction = setting.friction : this.friction = 0; // 마찰력
        setting.damping ? this.damping = setting.damping : this.damping = 0; // 저항력 (공기저항 등)

        // 입력받은 density 또는 mass 정리하고 mass로 변환, area와 inertia 구하기
        setting.mass ? this.mass = setting.mass : (setting.density ? null : setting.density = 1);
        setting.density || !setting.inertia && !setting.area ? setting.area = this.shape.getArea() : null;
        setting.density ? this.mass = setting.area * setting.density : null;
        setting.inertia ? this.inertia = setting.inertia : this.inertia = this.shape.getInertia(this.mass);

        this.collisionType === 'static' ? (this.invMass = 0, this.invInertia = 0) : (this.invMass = 1 / this.mass, this.invInertia = 1 / this.inertia); // 질량과 회전관성의 역수 (계산에 이용됨)
        this.v = new Vector2(); // 속도
        this.f = new Vector2(); // 힘
        this.angV = 0; // angular velocity. 각속도
        this.t = 0; // 토크
        this.totalF; // accumulated impulse를 위함.
    }

    get angle() {
        return this.#_angle;
    }

    set angle(value) {
        this.#_angle = value;
        this.shape.updateCheckSize(this.#_angle); // 각도 변경시 자동으로 사전 검사 크기 재조정
    }


    // 사전 충돌 검사
    static isPreCollision(rigidBody1, rigidBody2) {
        return (Math.max((rigidBody2.pos.x - rigidBody2.shape.checkLeft) - (rigidBody1.pos.x + rigidBody1.shape.checkRight), (rigidBody1.pos.x - rigidBody1.shape.checkLeft) - (rigidBody2.pos.x + rigidBody2.shape.checkRight)) >= 0) || (Math.max((rigidBody2.pos.y - rigidBody2.shape.checkDown) - (rigidBody1.pos.y + rigidBody1.shape.checkUp), (rigidBody1.pos.y - rigidBody1.shape.checkDown) - (rigidBody2.pos.y + rigidBody2.shape.checkUp)) >= 0);
    }

    // 정확한 충돌 검사, 모든 벡터량은 rigidBody1 기준으로
    static isCollision(checkType, rigidBody1, rigidBody2) {
        let normal; // 접촉면의 법선벡터
        let penetration = 0; // 침투(충돌) 정도
        let relativePos = rigidBody2.pos.minus(rigidBody1.pos); // 거리 차

        // 정확한 충돌 검사
        if (checkType === 'Circle-Circle') {
            penetration = (rigidBody1.shape.radius + rigidBody2.shape.radius) - Math.abs(relativePos.magnitude); // 충돌 정도
            if (penetration <= 0) return; // 충돌안함
            normal = relativePos.normalize(); // 접촉면의 법선벡터

        } else if (checkType === 'Circle-Convex') {
            const circle = rigidBody1;
            const obb = rigidBody2;
            // 나중에

        } else if (checkType === 'Convex-Convex') {
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

        return [normal, penetration];


        // 원-다각형 충돌 옛날꺼(참고용)
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

    static GetContactPoints(checkType, rigidBody1, rigidBody2, normal) {
        let contactPoints = []; // 접촉점들 (토크 계산시 필요)

        if (checkType === 'Circle-Circle')
            contactPoints.push(rigidBody1.pos.plus(normal.multiply(rigidBody1.shape.radius)));

        else if (checkType === 'Circle-Convex') {
            // 나중에

        } else if (checkType === 'Convex-Convex') {
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
            try {
                if (checkNormal.dot(contactPoints1[max1]) < checkNormal.dot(contactPoints2[max2])) contactPoints2.splice(max2, 1);
                else contactPoints1.splice(max1, 1);
            } catch {
                console.log(contactPoints1, contactPoints2);
            }

            contactPoints = [...contactPoints1, ...contactPoints2];
        }

        return contactPoints;
    }

    // 충돌 보정
    static CorrectionCollision(rigidBody1, rigidBody2, normal, penetration) {
        let distance = normal.multiply(penetration); // 총 보정 거리
        rigidBody1.pos = rigidBody1.pos.minus(distance.multiply(rigidBody1.invMass / (rigidBody1.invMass + rigidBody2.invMass))); // 질량을 이용해 조금 더 정확한 보정
        rigidBody2.pos = rigidBody2.pos.plus(distance.multiply(rigidBody2.invMass / (rigidBody1.invMass + rigidBody2.invMass)));
    }

    // 충돌 해결
    static ResolveCollision(rigidBody1, rigidBody2, normal, contactPoints) {
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
            rigidBody1.v = rigidBody1.v.minus(impulses[i].multiply(rigidBody1.invMass));
            rigidBody1.angV -= contacts1[i].cross(impulses[i]) * rigidBody1.invInertia;
            rigidBody2.v = rigidBody2.v.plus(impulses[i].multiply(rigidBody2.invMass));
            rigidBody2.angV += contacts2[i].cross(impulses[i]) * rigidBody2.invInertia;
            // box2d lite는 (여타 다른 강의들 포함) v를 바로 바꾸지만(이러면 fps 변수 안 써도 됨), 이러면 충돌 체크 순서에 따라 값이 다르게 나옴.
            // (왜 그렇게 하는지는 모르겠음) 그래서 나는 f랑 t를 바꿈
            // !!!! 이게 충격량을 한꺼번에 계산하고 그 뒤에 속도를 이동시키는 방법은 다중물체 충돌시 힘의 분산 (이것도 연속적이지 않기에 발생하는 문제)을 처리 할 수 없어서,
            // 이를 v가 아닌 f를 바꾸면 힘이 증폭하게 됨 (터지는 현상. 회전관성값의 문제가 아니었음.)
            /**
            rigidBody1.f = rigidBody1.f.minus(impulses[i].multiply(fps));
            rigidBody1.t -= contacts1[i].cross(impulses[i]) * fps;
            rigidBody2.f = rigidBody2.f.plus(impulses[i].multiply(fps));
            rigidBody2.t += contacts2[i].cross(impulses[i]) * fps;
            */
        }
        
        // accumulated impulse??? 조사하기
        /**
        let temp = rigidBody1.totalF;
        rigidBody1.totalF = Math.min(rigidBody1.totalF + normal.dot(rigidBody1.f), 0);
        if (!rigidBody1.totalF) rigidBody1.f.set(0, 0);
        //rigidBody1.f = totalF - temp
        rigidBody2.totalF = Math.max(rigidBody2.totalF + normal.dot(rigidBody2.f), 0);
        if (!rigidBody2.totalF) rigidBody2.f.set(0, 0);
        */
    }
}

//exports = RigidBody;