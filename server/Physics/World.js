class World {
    constructor() {
        this.rigidBodies = [];
    }

    update(fps) {
        const dt = 1 / fps; // delta time

        // move
        for (const rigidBody of this.rigidBodies) {
            // calc a
            rigidBody.a = rigidBody.f.divide(rigidBody.mass); // F = ma
            rigidBody.angA = rigidBody.t / rigidBody.rotationalInertia;
            // calc v
            rigidBody.v = rigidBody.v.plus(rigidBody.a.multiply(dt)); // dv = a * dt
            rigidBody.angV += rigidBody.angA * dt;
            // move x
            rigidBody.pos = rigidBody.pos.plus(rigidBody.v.multiply(dt)); // dx = v * dt
            rigidBody.angle += rigidBody.angV * dt;
        }

        // init f
        for (const rigidBody of this.rigidBodies) {
            rigidBody.f.set(0, 0);
            rigidBody.t = 0;
            rigidBody.correctionPos.set(0, 0);
        }

        // calc f
        for (let i = 0; i < this.rigidBodies.length - 1; i++)
            for (let j = i + 1; j < this.rigidBodies.length; j++)
                RigidBody.checkCollision(fps, this.rigidBodies[i], this.rigidBodies[j]);

        // apply correction
        for (const rigidBody of this.rigidBodies) rigidBody.pos = rigidBody.pos.plus(rigidBody.correctionPos);
        
        //console.log(this.rigidBodies[0].correctionPos);
        //console.log(this.rigidBodies[0].v, this.rigidBodies[1].v);
    }
}

//module.exports = World;