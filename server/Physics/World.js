class World {
    constructor() {
        this.rigidBodies = [];
    }

    update(fps, repetition) {
        fps *= repetition;
        const dt = 1 / fps; // delta time

        //for (const rigidBody of this.rigidBodies)
            //rigidBody.totalF = new Array(rigidBody.shape.points.length);

        for (let rep = 0; rep < repetition; rep++) {
            // move
            for (const rigidBody of this.rigidBodies) {
                if (rigidBody.collisionType === 'static') continue;
                // calc v
                rigidBody.v = rigidBody.v.plus(rigidBody.f.multiply(rigidBody.invMass * dt)); // dv = F/m(=a) * dt
                rigidBody.v = rigidBody.v.multiply(0.999);
                //if (rigidBody.v.magnitude < 1) rigidBody.v.set(0, 0);
                //else rigidBody.v.minus(rigidBody.v.normalize() * 1);
                rigidBody.angV += rigidBody.t * rigidBody.invInertia * dt;
                rigidBody.angV *= 0.999;
                // move x
                rigidBody.pos = rigidBody.pos.plus(rigidBody.v.multiply(dt)); // dx = v * dt
                if (rigidBody.angV * dt !== 0) // 자동 updateCheckSize 최적화를 위함.
                    rigidBody.angle += rigidBody.angV * dt;
            }

            // init f
            for (const rigidBody of this.rigidBodies) {
                rigidBody.f.set(0, 0); // 중력은 0, 9.8 * fps * rigidBody.mass
                rigidBody.t = 0;
            }

            // calc f
            for (let i = 0; i < this.rigidBodies.length - 1; i++) {
                const rigidBody1 = this.rigidBodies[i];
                for (let j = i + 1; j < this.rigidBodies.length; j++) {
                    const rigidBody2 = this.rigidBodies[j];

                    // 완료 - 이 world 절차대로 각 rigidBody 정적메서드 분리하고 알맞게 변수얻고 수정하면 됨
                    // 이 뒤에는 jittering해결 + repitition 추가, friction, damping 추가하고 circle-convex 충돌 개발 하면 됨 (가능하면 OBB 최적화도)
                    if (rigidBody1.collisionType === 'static' && rigidBody2.collisionType === 'static') continue;

                    if (RigidBody.isPreCollision(rigidBody1, rigidBody2)) continue;
                    let checkType; // 충돌 체크 타입
                    rigidBody1.shape.type === 'Circle' && rigidBody2.shape.type === 'Circle' ? checkType = 'Circle-Circle' : (
                        (rigidBody1.shape.type === 'Circle' && rigidBody2.shape.type === 'Convex') || (rigidBody1.shape.type === 'Convex' && rigidBody2.shape.type === 'Circle') ? checkType = 'Circle-Convex' : (
                            rigidBody1.shape.type === 'Convex' && rigidBody2.shape.type === 'Convex' ? checkType = 'Convex-Convex' : null
                        )
                    );
                    const result = RigidBody.isCollision(checkType, rigidBody1, rigidBody2);
                    let normal, penetration;
                    if (result === undefined) continue;
                    else [normal, penetration] = result;

                    if (rigidBody1.collisionType === 'only-collide' || rigidBody2.collisionType === 'only-collide') continue;
                    if (rigidBody1.collisionType !== 'dynamic' && rigidBody1.collisionType !== 'static' && rigidBody1.collisionType === rigidBody2.collisionType) continue;
                    
                    RigidBody.CorrectionCollision(rigidBody1, rigidBody2, normal, penetration);
                    const contactPoints = RigidBody.GetContactPoints(checkType, rigidBody1, rigidBody2, normal);
                    RigidBody.ResolveCollision(rigidBody1, rigidBody2, normal, contactPoints);
                }
            }
        }
    }
}

//module.exports = World;