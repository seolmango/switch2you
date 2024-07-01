const { Vector2, Circle, OBB, RigidBody, World } = require('./Physics/index.js');


class MapBuilder {
    map;

    create() {
        this.map = new World();
    }

    /**
     * 위치와 플레이어 수를 입력하면 플레이어 수 만큼 위치를 랜덤으로 할당에 맵에 플레이어를 추가합니다.
     * @param {*} poses 위치 리스트
     * @param {Int} playerCount 플레이어 수
     */
    setPlayer(poses, playerCount) {
        for (let i = 0; i < playerCount; i++) {
            let pos = poses.splice(randomInt(0, poses.length), 1)[0];
            this.map.rigidBodies.push(new RigidBody(new Circle(40), new Vector2(pos[0], pos[1]), {name: `player${i + 1}`, collisionType: 'player'}));
        }
    }

    setMagneticField() {

    }

    setWall() {

    }

    setObject() {

    }

    getProduct() {
        return this.map;
    }
}


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = MapBuilder;