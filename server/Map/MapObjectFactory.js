/**
 * <mapObject 추가시 주의사항>
 * 각 data는 반드시 deepcopy를 해야함. (MapLoader의 cache가 반복적으로 사용돼서 그럼)
 */


const { Vector2, Circle, OBB, RigidBody, World } = require('../Physics/index.js');


/**
 * MapObject는 RigidBody의 shape, pos, setting 속성을 포함합니다.
 */
class MapObjectFactory {
    create(data) { // 팩토리 메서드 (패턴)
        let mapObject;
        let pos = new Vector2(data.pos[0], data.pos[1]);
        if (data.name == 'player') {
            mapObject = new RigidBody(new Circle(40), pos, {name: data.name, collisionType: 'player'});
        } else if (data.name == 'wall') {
            mapObject = new RigidBody(new OBB(), pos, {name: data.name, collisionType: 'static'});
        }
        return mapObject;
    }
}

module.exports = MapObjectFactory;