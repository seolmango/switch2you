const { Vector2 } = require('./Physics/Vector2.js');
const MapBuilder = require('./MapBuilder.js');


class MapDirector {
    mapNames = ['park'];
    mapBuilder = new MapBuilder();

    create(mapName, playerCount) {
        this.mapBuilder.create();

        // 플레이어 지름 길이: 80, 권장되는 최소 통로 너비: 100
        // 맵 크기: 1500*1500, 초당 30감소
        if (mapName === 'park') {
            this.mapBuilder.setPlayer([[150, 150], [750, 150], [1350, 150], [1350, 750], [1350, 1350], [750, 1350], [150, 1350], [150, 750]], playerCount);
            this.mapBuilder.setMagneticField(1500, 1500, 500, 500, 30);
            this.mapBuilder.setWall();
            this.mapBuilder.setObject();
        }

        return this.mapBuilder.getProduct();
    }
}

module.exports = MapDirector;