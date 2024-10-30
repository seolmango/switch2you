const { Vector2, Circle, OBB, RigidBody, World } = require('./Physics/index.js');


// 이거를 factory로 할지 builder&director로 할지 고민 많이 함.
// 근데 아무래도 builder를 여러 기능이 있는 "tool"의 관점으로 봐서 builder를 쓰는게 나을것 같았음.
// 물론 factory + tool로 해도 되지만, tool을 추가할때 좀 더 체계화 되어있지 않을꺼라고 생각해서, 그 자체로 규칙적인 builder를 tool처럼 쓰기로 결정함.
// -> 아무리봐도 빌더는 이상하고 팩토리+tool나을것 같다.
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
        // 1. 자기장 정보 2. 자기장 업데이트 3. 자기장 충돌 계산 후 반응
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
    // 1. 직접 방법 map builder를 거치지 않고 director에서 rigidBody 바로 만들고 추가
    // 2. 나누는 방법 map builder에 각각 addBall, addTree 등 여러 다양한 사물을 추가 하는 메서드를 추가
    // 근데 어차피 랜덤/새로운거 할때마다 추가할꺼면 그냥 director에서 직접 만드는게 나을것 같은데??
    // 3. 아니면 map builder -> map 관련된 기본적인 설정만 한 뒤 map 반환만 하는 애라는 관점으로 생각하고,
    // 그 이후에 director 가 커스텀 한다고 생각하면...
    addWall(shape, pos) {
        setting = {
            collisionType: "static"
        }
        this.map.rigidBodies.push(new RigidBody(shape, pos, setting));
        // shape => 커스텀, pos => 커스텀, setting => 커스텀
        // 따로 함수 만들어서 이득이 될께 없음
        // 그럼 지금 있는 setPlayer는? 있으면 도움이 되긴하는데
        // wall이 정해져있다는 관점??? 아무리봐도 빌더는 아닌것 같다...
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