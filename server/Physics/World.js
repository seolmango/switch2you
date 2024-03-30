class World {
    constructor() {
        this.rigidBodies = [];
    }

    update(fps) {
        const dt = 1 / fps; // delta time

        // move
        for (const rigidBody of this.rigidBodies) {
            if (rigidBody.isStatic) continue;
            // calc a
            /**let fric = fps * fps * 400 // 임시마찰력
            rigidBody.f = rigidBody.f.minus(rigidBody.v.normalize().multiply(fric));*/
            rigidBody.a = rigidBody.f.multiply(rigidBody.invMass); // F = ma
            rigidBody.angA = rigidBody.t * rigidBody.invInertia;
            // calc v
            rigidBody.v = rigidBody.v.plus(rigidBody.a.multiply(dt)); // dv = a * dt
            rigidBody.v = rigidBody.v.multiply(0.99);
            //if (rigidBody.v.magnitude < 1) rigidBody.v.set(0, 0);
            //else rigidBody.v.minus(rigidBody.v.normalize() * 1);
            rigidBody.angV += rigidBody.angA * dt;
            rigidBody.angV *= 0.99;
            // move x
            rigidBody.pos = rigidBody.pos.plus(rigidBody.v.multiply(dt)); // dx = v * dt
            if (rigidBody.angV * dt !== 0) // 자동 updateCheckSize 최적화를 위함.
                rigidBody.angle += rigidBody.angV * dt;
        }

        // init f
        for (const rigidBody of this.rigidBodies) {
            rigidBody.f.set(0, 0); // 중력은 0, 300 * rigidBody.mass
            rigidBody.t = 0;
            rigidBody.shape.contacts = [];
        }

        // calc f
        for (let i = 0; i < this.rigidBodies.length - 1; i++)
            for (let j = i + 1; j < this.rigidBodies.length; j++) {
                if (this.rigidBodies[i].isStatic && this.rigidBodies[j].isStatic) continue;
                RigidBody.checkCollision(fps, this.rigidBodies[i], this.rigidBodies[j]);
            }
    }
}

//module.exports = World;