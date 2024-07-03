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

    setMagneticField(width, height, minWidth, minHeight, speed) {
        // 자기장은 rigidBody가 아닌 world 차원에서 따로 계산해줘야 할듯. 시간&맵크기 이용해서
        // 닿는 블록 모두 파괴 & 플레이어만 밀려나기
        // 여기서 플레이어는 모두 원이니, 복잡한 계산과정이 없어도 됨.
        // 즉 world 차원에 가능한 작업
        // 1. 자기장 정보 2. 자기장 업데이트 3. 플레이어와만 계산
        // 이걸 어디서 어떻게 하지?
        this.map.magneticField = {
            maxWidth: width,
            maxHeight: height,
            width: width,
            height: height,
            minWidth: minWidth,
            minHeight: minHeight,
            speed: speed
        }
    }

    // 너무 당연한 작업을 builder가 전가받아서 수행하게 됨. 너무 비효율적인것 같음.
    addWall() {
        this.map.rigidBodies.push(new RigidBody())
    }

    addObject() {

    }

    getProduct() {
        return this.map;
    }
}


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = MapBuilder;