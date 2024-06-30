const { Vector2, Circle, OBB, RigidBody, World } = require('./Physics/index.js');


// 나중에 맵 랜덤성을 위해 빌더로?
class MapFactory {
    mapNames = ['park'];

    create(name) {
        if (name === 'park') {
            let world = new World();
            for (let i = 0; i < 8; i++)
                world.rigidBodies.push(new RigidBody(new Circle(40, 40), new Vector2(i * 100 + 100, 100), {collisionType: 'player'}));
            world.rigidBodies.push(new RigidBody(new OBB(100, 100), new Vector2(200, 200), {collisionType: 'dynamic'}));

            return world;
        }
    }
}

module.exports = MapFactory;