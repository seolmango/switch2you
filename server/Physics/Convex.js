//const Shape = require('./Shape.js');


class Convex extends Shape {
    #_angle; #_points; #_rotationedPoints;

    constructor(points = []) {
        super('Convex');
        this.#_angle = 0;
        this.#_points = points; // point 와 normal(법선 벡터)의 변은 반드시 인접해야함.즉, 이걸 고려해서 getNormals 만들기. 방향과의 통일을 위해 반시계방향으로 저장
        this.#_rotationedPoints = []; // 회전된 points
        this.contacts = []; // 접촉한 점들의 좌표 (리스트의 인덱스로 할 수 있으나, 이 방법이 더 편함)
    }

    get points() {
        return this.#_points;
    }

    // points가 바뀌면 바로 rotationPoints 업데이트하고 checkSize 변경
    set points(value) {
        this.#_points = value;
        this.#updateCheckSize();
    }

    // rotationedPoints는 points에 결속돼있기 때문에 수정이 불가능함. 그때 그때 계산해서 반환하면 최적화문제가 생기니 private 변수 따로 만들어서 보관함.
    get rotationedPoints() {
        return this.#_rotationedPoints;
    }

    // 여러 작업을 할때, angle이 필요한데, 그때그때 받으면 불편해서 RigidBody의 angle이 바뀔때마다 angle을 저장함.
    updateCheckSize(angle) {
        this.#_angle = angle;
        if (this.points.length !== 0) this.#updateCheckSize(); // 특수한 방식으로 rigidBody를 생성할때 updateCheckSize를 2번을 하지 않기 위함
    }

    #updateCheckSize() {
        this.#rotationPoints();
        [this.checkLeft, this.checkRight] = this.getProjections(new Vector2(1, 0));
        [this.checkDown, this.checkUp] = this.getProjections(new Vector2(0, 1));
    }

    // rotationedPoints 업데이트
    #rotationPoints() {
        this.#_rotationedPoints = this.points.map(point => point.rotationConversion(this.#_angle));
    }

    getNormals() {
        let normals = [];
        for (let i = 0; i < this.rotationedPoints.length; i++) {
            let relativePos = this.rotationedPoints[i].minus(this.rotationedPoints[(i + 1) % this.rotationedPoints.length]); // 인접한 꼭짓점 좌표차 구하고 (법선벡터의 변은 꼭짓점 바로 왼쪽에 위치함)
            normals.push((new Vector2(-relativePos.y, relativePos.x)).normalize()); // 90도 돌려서 법선벡터 구하기
        }
        return normals;
    }

    getProjections(normal) {
        let points = this.rotationedPoints.map(point => normal.dot(point));
        let min = 0;
        let max = 0;
        for (let point of points)
            if (min > point) min = point;
            else if (max < point) max = point;
        return [-min, max];
    }
}

//module.exports = Convex;