const Vector2 = require('./Vector2.js');


// 강체
class RigidBody {
    #_angle; // 각도

    // 필수 - shape (구조체가 아닌 객체라, 참조 관리의 편의성을 위해 따로 매개변수로 작성) / only-collide에 한정해 callback 필수
    // 선택 - name, collisionType, angle, restitution, friction, damping, density/mass, area, inertia
    // 항상 각 강체마다 Shape를 여러개 가질 수 있다는 걸 고려하고 필드를 만들어야 함.
    // Shapes가 묶여서 한 물체로 인식되려면, 모양에 대한 정보말고는 가지고 있으면 안됨.
    constructor(shape, pos, setting) {
        this.shape = shape; // 모양
        this.pos = pos;

        // 충돌 처리 4종류 (충돌감지를 해야하는건 무조건 World에서 처리. 안해도되면 World에서 처리안하는게 좋음. (최적화))
        // only-collide: 충돌하고 반응 안함. / 풀, 아이템
        // dynamic: 충돌하고 반응 함. / 일반적인 물체
        // static: 충돌하고 반응 함. 반응 시 밀리지 않음. / 벽
        // 그 외 모든 type: 같은 type끼리는 충돌하고 반응 안함. 다른 type과는 충돌하고 반응 함. / 플레이어
        setting.name ? this.name = setting.name : null;
        setting.collisionType ? this.collisionType = setting.collisionType : this.collisionType = 'dynamic';
        setting.angle ? this.angle = setting.angle : this.angle = 0;
        setting.restitution ? this.restitution = setting.restitution : this.restitution = 0; // 복원력 (탄성계수)
        setting.friction ? this.friction = setting.friction : this.friction = 1; // 마찰력
        setting.damping ? this.damping = setting.damping : this.damping = 1; // 저항력 (공기저항 등)

        // 질량과 회전관성의 역수 (계산에 이용됨) static의 경우 mass와 inertia는 무한으로 간주되기에 계산시 역수만 사용함.
        if (this.collisionType === 'static') {
            this.invMass = 0;
            this.invInertia = 0;
        } else {
            // 입력받은 density 또는 mass 정리하고 mass로 변환, area와 inertia 구하기
            setting.mass ? this.mass = setting.mass : (setting.density ? null : setting.density = 1);
            setting.density || !setting.inertia && !setting.area ? setting.area = this.shape.getArea() : null;
            setting.density ? this.mass = setting.area * setting.density : null;
            setting.inertia ? this.inertia = setting.inertia : this.inertia = this.shape.getInertia(this.mass);
            this.invMass = 1 / this.mass;
            this.invInertia = 1 / this.inertia;

            // collisionType이 only-collide 또는 커스텀 type 이라면 충돌시 callback 추가
            if (this.collisionType !== 'dynamic' && this.collisionType !== 'static')
                setting.callback ? this.callback = setting.callback : this.callback = () => {};
        }

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
        let penetration = 0; // 침투(충돌) 정도 (mtv)
        let relativePos = rigidBody2.pos.minus(rigidBody1.pos); // 거리 차

        // 정확한 충돌 검사
        if (checkType === 'Circle-Circle') {
            penetration = (rigidBody1.shape.radius + rigidBody2.shape.radius) - relativePos.magnitude; // 충돌 정도
            if (penetration <= 0) return; // 충돌안함
            normal = relativePos.normalize(); // 접촉면의 법선벡터

        } else if (checkType === 'Circle-Convex') {
            let circle, convex;
            if (rigidBody1.shape.type === 'Circle') {
                circle = rigidBody1;
                convex = rigidBody2;
            } else {
                circle = rigidBody2;
                convex = rigidBody1;
            }
            
            const normals = convex.shape.getNormals();

            let isSAT = true; // circle의 좌표에 따라 충돌을 SAT 아니면 꼭짓점으로 부터의 거리 차로 감지할건지 나뉨.
            let points = convex.shape.rotationedPoints;
            for (let i = 0; i < points.length; i++) {
                let point = points[(i + 1) % points.length]
                let axis1 = point.minus(points[i]);
                let axis2 = point.minus(points[(i + 2) % points.length]);
                let dPos = circle.pos.minus(convex.pos.plus(point));
                if ((axis1.dot(dPos) > 0) && (axis2.dot(dPos) > 0)) { // SAT로 감지 불가능한 circle 좌표 판별
                    // SAT가 아닌 꼭짓점으로 부터의 거리의 차를 이용해 감지
                    if (dPos.magnitude >= circle.shape.radius) return; // 충돌안함
                    isSAT = false;
                    normal = dPos.normalize().multiply(-1);
                    penetration = circle.shape.radius + normal.dot(dPos);
                    break;
                }
            }

            if (isSAT) {
                for (let checkNormal of normals) {
                    let [left1, right1] = convex.shape.getProjection(checkNormal);
                    let pos1 = checkNormal.dot(convex.pos);
                    let pos2 = checkNormal.dot(circle.pos);
                    left1 = pos1 - left1;
                    right1 = pos1 + right1;
                    let left2 = pos2 - circle.shape.radius;
                    let right2 = pos2 + circle.shape.radius;
                    if ((left2 >= right1) || (left1 >= right2)) return; // 충돌안함
                    let r = Math.min(right1 - left2, right2 - left1);
                    if (penetration === 0 || penetration > r) {
                        penetration = r;
                        normal = checkNormal;
                    }
                }
            }

            if (normal.dot(relativePos) < 0)
                normal = normal.multiply(-1);

        } else if (checkType === 'Convex-Convex') {
            const normals = [...rigidBody1.shape.getNormals(), ...rigidBody2.shape.getNormals()];

            for (let checkNormal of normals) {
                let [left1, right1] = rigidBody1.shape.getProjection(checkNormal);
                let [left2, right2] = rigidBody2.shape.getProjection(checkNormal);
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
    }

    static GetContactPoints(checkType, rigidBody1, rigidBody2, normal) {
        let contactPoints = []; // 접촉점들 (토크 계산시 필요)

        if (checkType === 'Circle-Circle')
            contactPoints.push(rigidBody1.pos.plus(normal.multiply(rigidBody1.shape.radius)));

        else if (checkType === 'Circle-Convex') {
            let circle;
            if (rigidBody1.shape.type === 'Circle') circle = rigidBody1
            else {
                circle = rigidBody2;
                normal = normal.multiply(-1);
            }
            contactPoints.push(circle.pos.plus(normal.multiply(circle.shape.radius)));

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
            contactPoints = [...contactPoints1, ...contactPoints2];

            // 수직으로 돌려 양 끝점 제거 (수직 단위 벡터에 내적)
            // 강체의 꼭짓점이 변 위에 놓여있으면 안됨. (그럼 위 감지 코드에서 contactPoints의 길이가 3이 넘어버려서 문제가 발생함.)
            let checkNormal = new Vector2(-normal.y, normal.x);

            let maxI = 0, minI = 0
            for (let i = 0; i < contactPoints.length; i++) {
                let dot = checkNormal.dot(contactPoints[i]);
                let maxDot = checkNormal.dot(contactPoints[maxI]);
                if (dot > maxDot) {
                    maxI = i;
                    continue;
                }
                let minDot = checkNormal.dot(contactPoints[minI]);
                if (dot < minDot) {
                    minI = i;
                }
            }
            
            contactPoints.splice(maxI, 1);
            if(maxI < minI) minI--;
            contactPoints.splice(minI, 1);
        }

        return contactPoints;
    }

    // 충돌 보정
    static CorrectionCollision(rigidBody1, rigidBody2, normal, penetration) {
        let distance = normal.multiply(penetration); // 총 보정 거리
        rigidBody1.pos = rigidBody1.pos.minus(distance.multiply(rigidBody1.invMass / (rigidBody1.invMass + rigidBody2.invMass))); // 질량을 이용해 조금 더 정확한 보정
        rigidBody2.pos = rigidBody2.pos.plus(distance.multiply(rigidBody2.invMass / (rigidBody1.invMass + rigidBody2.invMass)));
    }

    // 충돌 해결. 위치 이동을 normal, 회전 이동을 tangent라 말하는것 같음.
    static ResolveCollision(rigidBody1, rigidBody2, normal, contactPoints) {
        const e = Math.min(rigidBody1.restitution, rigidBody2.restitution);
        const friction = (rigidBody1.friction + rigidBody2.friction) * 0.5;
        for (let i = 0; i < contactPoints.length; i++) {
            let contact1 = contactPoints[i].minus(rigidBody1.pos); // 접촉점에 대해 각 강체를 원점으로 한 벡터
            let contact2 = contactPoints[i].minus(rigidBody2.pos);
            let normal1 = new Vector2(-contact1.y, contact1.x); // 접촉점 벡터의 수직 벡터 (각속도니까)
            let normal2 = new Vector2(-contact2.y, contact2.x); // ?? 둘이 코드가 다름 1. mass normal이 뭐지 2. 각 코드의 차이가 뭐지
            let angV1 = normal1.multiply(rigidBody1.angV); // 수직 벡터에 속도를 곱함
            let angV2 = normal2.multiply(rigidBody2.angV);
            let relativeV = rigidBody2.v.plus(angV2).minus(rigidBody1.v.plus(angV1)); // 각 접촉점의 법선벡터 기준 속도 차
            let relativeVN = normal.dot(relativeV);
            if (relativeVN > 0) continue; // 접촉점이 서로 멀어지고 있는가?

            // accumulate impulse
            // 기본적으로 가우스-자이델 방법을 사용. 반복 계산을 통해 여러 다항식의 해에 근사하기
            // 왜 단일 충돌시 힘이 누적되지 않는거지? -> 속도차에 의한것이라 추정 (글로벌 솔루션 도달)
            // 그럼 탄성이 1일때 글로벌 솔루션이 안 도달하지 않나? (힘값이 진동)

            // 이거 도대체 뭐냐?????
            // 왜 이해가 안돼지
            // 1. 반복연산 하는건 알겠는데 이게 왜 글로벌 솔루션에 도달하는가? (jittering 해결)
            // - ???????
            // 2. 다연산시 동일 방향의 힘의 증폭은 어떻게 처리할것인가?
            // - ???
            // 3. 각 충돌점의 고유 id를 만들고 유지해야 하는가?
            // - 실제로 보면 abiter는 매 계산마다 초기화되는게 아닌, 추가 또는 삭제가 됨 (= 유지)
            // - gdc 강연에 직접적으로 나와있는 내용

            let f1 = normal.dot(normal1);
            let f2 = normal.dot(normal2);
            let j = -(1 + e) * relativeVN;
            // mass normal?? box2d-lite에서 사용한 방식대로 하면 이상하게 움직이는데 왜 그런지 모르겠음. 이거는 다른 방법
            j /= rigidBody1.invMass + rigidBody2.invMass + f1 * f1 * rigidBody1.invInertia + f2 * f2 * rigidBody2.invInertia;
            j /= contactPoints.length;
            let impulse = normal.multiply(j);

            // 이게 충격량을 한꺼번에 계산하고 그 뒤에 속도를 이동시키는 방법은 다중물체 충돌시 힘의 분산 (이것도 연속적이지 않기에 발생하는 문제)을 처리 할 수 없어서,
            // 이를 v가 아닌 f를 바꾸면 힘이 증폭하게 됨 (터지는 현상. 회전관성값의 문제가 아니었음.)
            rigidBody1.v = rigidBody1.v.minus(impulse.multiply(rigidBody1.invMass));
            rigidBody1.angV -= contact1.cross(impulse) * rigidBody1.invInertia;
            rigidBody2.v = rigidBody2.v.plus(impulse.multiply(rigidBody2.invMass));
            rigidBody2.angV += contact2.cross(impulse) * rigidBody2.invInertia;

            let tangent = relativeV.minus(normal.multiply(normal.dot(relativeV))).normalize();
            let f1t = normal1.dot(tangent);
            let f2t = normal2.dot(tangent);

            let jt = -tangent.dot(relativeV);
            // mass tanget??
            jt /= rigidBody1.invMass + rigidBody2.invMass + f1t * f1t * rigidBody1.invInertia + f2t * f2t * rigidBody2.invInertia;
            jt /= contactPoints.length;
            let frictionImpulse;
            if (Math.abs(jt) <= j * friction) frictionImpulse = tangent.multiply(jt); // 정적마찰력. 움직이지 않음.
            else frictionImpulse = tangent.multiply(-j * friction); // 동적 마찰력

            rigidBody1.v = rigidBody1.v.minus(frictionImpulse.multiply(rigidBody1.invMass));
            rigidBody1.angV -= contact1.cross(frictionImpulse) * rigidBody1.invInertia;
            rigidBody2.v = rigidBody2.v.plus(frictionImpulse.multiply(rigidBody2.invMass));
            rigidBody2.angV += contact2.cross(frictionImpulse) * rigidBody2.invInertia;
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

module.exports = RigidBody;