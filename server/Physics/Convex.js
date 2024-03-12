//const Shape = require('./Shape.js');


class Convex extends Shape {
    constructor() {
        super('Convex');
        this.points = []; // point 와 normal(법선 벡터)의 변은 반드시 인접해야함.즉, 이걸 고려해서 getNormals 만들기. 방향과의 통일을 위해 반시계방향으로 저장
    }

    updateCheckSize(angle) {
        // 나중에
    }

    getPoints(angle) {
        return this.points.map(point => point.rotationConversion(angle));
    }

    getNormals(angle) {
        let normals = [];
        let rotationPoints = this.points.map(point => point.rotationConversion(angle)); // 기본 꼭짓점 좌표를 각도에 따라 회전변환
        for (let i = 0; i < this.points.length; i++) {
            let relativePos = rotationPoints[i].minus(rotationPoints[(i + 1) % rotationPoints.length]); // 인접한 꼭짓점 좌표차 구하고 (법선벡터의 변은 꼭짓점 바로 왼쪽에 위치함)
            normals.push((new Vector2(-relativePos.y, relativePos.x)).normalize()); // 90도 돌려서 법선벡터 구하기
        }
        return normals;
    }
}

//module.exports = Convex;