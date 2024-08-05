const { RigidBody } = require('./index.js');

class World {
    magneticField = null;
    rigidBodies = [];

    constructor(magneticField = null) {
        if (magneticField)
            this.magneticField = magneticField;
    }

    update(fps, repetition) {
        fps *= repetition;
        const dt = 1 / fps; // delta time

        for (let rep = 0; rep < repetition; rep++) {
            this.step(dt);
            this.collision(dt);
            if (this.magneticField) this.magneticFieldUpdate();
        }
    }

    step(dt) {
        // move
        for (const rigidBody of this.rigidBodies) {
            if (rigidBody.collisionType === 'static' || rigidBody.collisionType === 'only-collide') continue;
            // calc v
            rigidBody.v = rigidBody.v.plus(rigidBody.f.multiply(rigidBody.invMass * dt)); // dv = F/m(=a) * dt
            //rigidBody.v.y += 9.8 / repetition * 2; // 중력
            rigidBody.v = rigidBody.v.multiply(1 - rigidBody.damping * dt); // 공기저항
            rigidBody.v = rigidBody.v.minus(rigidBody.v.multiply(rigidBody.friction * dt)); // 마찰력
            rigidBody.angV += rigidBody.t * rigidBody.invInertia * dt;
            rigidBody.angV *= 1 - rigidBody.damping * dt; // 공기저항
            rigidBody.angV -= rigidBody.angV * rigidBody.friction * dt; // 마찰력
            // move x
            rigidBody.pos = rigidBody.pos.plus(rigidBody.v.multiply(dt)); // dx = v * dt
            if (rigidBody.angV * dt !== 0) // 자동 updateCheckSize 최적화를 위함.
                rigidBody.angle += rigidBody.angV * dt;

            // init f
            rigidBody.f.set(0, 0);
            rigidBody.t = 0;
        }
    }

    collision() {
        // calc f
        for (let i = 0; i < this.rigidBodies.length - 1; i++) {
            const rigidBody1 = this.rigidBodies[i];
            for (let j = i + 1; j < this.rigidBodies.length; j++) {
                const rigidBody2 = this.rigidBodies[j];
                if (rigidBody1.collisionType === 'static' && rigidBody2.collisionType === 'static') continue;

                if (RigidBody.isPreCollision(rigidBody1, rigidBody2)) continue;
                let checkType; // 충돌 체크 타입
                rigidBody1.shape.type === 'Circle' && rigidBody2.shape.type === 'Circle' ? checkType = 'Circle-Circle'
                    : (rigidBody1.shape.type === 'Circle' && rigidBody2.shape.type === 'Convex') || (rigidBody1.shape.type === 'Convex' && rigidBody2.shape.type === 'Circle') ? checkType = 'Circle-Convex'
                    : rigidBody1.shape.type === 'Convex' && rigidBody2.shape.type === 'Convex' ? checkType = 'Convex-Convex'
                    : null;
                const result = RigidBody.isCollision(checkType, rigidBody1, rigidBody2);
                let normal, penetration;
                if (result === undefined) continue;
                else [normal, penetration] = result;

                if (rigidBody1.collisionType === 'only-collide' || rigidBody2.collisionType === 'only-collide') {
                    if (rigidBody1.collisionType !== 'only-collide') rigidBody2.callback(rigidBody2, rigidBody1, penetration);
                    if (rigidBody2.collisionType !== 'only-collide') rigidBody1.callback(rigidBody1, rigidBody2, penetration);
                    continue;
                }
                if (rigidBody1.collisionType !== 'dynamic' && rigidBody1.collisionType !== 'static' && rigidBody1.collisionType === rigidBody2.collisionType) {
                    rigidBody1.callback(rigidBody1, rigidBody2, penetration);
                    rigidBody2.callback(rigidBody2, rigidBody1, penetration);
                    continue;
                }
                
                RigidBody.CorrectionCollision(rigidBody1, rigidBody2, normal, penetration);
                const contactPoints = RigidBody.GetContactPoints(checkType, rigidBody1, rigidBody2, normal);
                RigidBody.ResolveCollision(rigidBody1, rigidBody2, normal, contactPoints);
            }
        }
    }

    magneticFieldUpdate(dt) {
        let speed = this.magneticField.speed * dt
        this.magneticField.width -= speed;
        this.magneticField.height -= speed;
        if (this.magneticField.width < this.magneticField.minWidth) this.magneticField.width = this.magneticField.minWidth;
        if (this.magneticField.height < this.magneticField.minHeight) this.magneticField.height = this.magneticField.minHeight;

        let dWidth = (this.magneticField.maxWidth - this.magneticField.width) * 0.5;
        let dHeight = (this.magneticField.maxHeight - this.magneticField.height) * 0.5;
        for (let i = 0; i < this.rigidBodies.length; i++) {
            const rigidBody = this.rigidBodies[i];
            if (rigidBody.collisionType === 'player') {
                if (rigidBody.pos.x - rigidBody.shape.checkLeft < dWidth)
                    rigidBody.pos.x = dWidth + rigidBody.shape.checkLeft;
                else if (rigidBody.pos.x + rigidBody.shape.checkRight > this.magneticField.maxWidth - dWidth)
                    rigidBody.pos.x = this.magneticField.maxWidth - dWidth + rigidBody.shape.checkRight;
                else if (rigidBody.pos.y - rigidBody.shape.checkDown < dHeight)
                    rigidBody.pos.y = dHeight + rigidBody.shape.checkDown;
                else if (rigidBody.pos.y + rigidBody.shape.checkUp > this.magneticField.maxHeight - dHeight)
                    rigidBody.pos.y = this.magneticField.maxHeight - dHeight + rigidBody.shape.checkUp;
            } else {
                if ((rigidBody.pos.x - rigidBody.shape.checkLeft < dWidth) || (rigidBody.pos.x + rigidBody.shape.checkRight > this.magneticField.maxWidth - dWidth) || (rigidBody.pos.y - rigidBody.shape.checkDown < dHeight) || (rigidBody.pos.y + rigidBody.shape.checkUp > this.magneticField.maxHeight - dHeight))
                    this.rigidBodies.splice(i, 0);
            }
        }
    }
}

module.exports = World;