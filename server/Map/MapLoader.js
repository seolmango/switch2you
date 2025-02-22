const MapObjectFactory = require('./MapObjectFactory.js');
const { randomInt } = require('../Utils/random.js');
const { Vector2, Circle, OBB, RigidBody, World } = require('../Physics/index.js');

// to do
// mapbuilder, director 다 없애고 factory+loader로 전환, 맵 json으로 불러오기
// physics의 자기장 손봐야할것 같음
// (사실 physics 전체를 체계적으로 손봐야 함)

// custom 맵보다 기본 맵을 훨씬 더 많이 플레이할꺼라 추측되니,
// 최적화를 위해 기본 맵은 미리 불러와 둬야 함.



class MapLoader {
    #mapDataDir; #mapObjectFactory; #cache; // cache는 JSON.parse 최적화를 위함
    
    constructor() {
        this.#mapDataDir = './Maps/';
        this.#mapObjectFactory = new MapObjectFactory();
    }

    /**
     * json파일을 map으로 변환 후 반환합니다.
     * @param {string} name 파일 이름 (확장자 제외)
     * @returns map
     */
    load(name, playerCount) {
        // json parse
        let map = new World();
        if (this.#cache[name] == undefined)
            this.#cache[name] = JSON.parse(require(`${this.#mapDataDir}${this.name}.json`));
        let mapData = this.#cache[name];

        // 자기장
        let mf = mapData.magneticField;
        map.magneticField = {
            maxWidth: mf.size[0],
            maxHeight: mf.size[1],
            width: mf.size[0],
            height: mf.size[1],
            minWidth: mf.minSize[0],
            minHeight: mf.minSize[1],
            speed: mf.speed
        }
        map.magneticField = map.megneticField;

        // 플레이어 스폰
        let pop = [0,1,2,3,4,5,6,7]
        for (let i = 0; i < playerCount; i++) {
            let index = pop.splice(randomInt(0, pop.length), 1);
            let mapObject = this.#mapObjectFactory.create({name: 'player', pos: mapData.spawns[index]});
            mapObject.name += `${i + 1}`;
        }
        
        // 맵 오브젝트
        for (let objData of mapData.objects) {
            let mapObject = this.#mapObjectFactory.create(objData[0]);
            map.rigidBodies.push(mapObject);
        }
        return map;
    }
}

module.exports = MapLoader;