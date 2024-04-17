//const Vector2 = require('./Vector2.js');


class Shape {
    constructor(type) {
        this.type = type; // 도형 종류
        this.checkRight; // 사전 검사용 콜라이더 크기. 절반
        this.checkLeft;
        this.checkUp;
        this.checkDown;
    }

    // 넓이 구하기
    getArea() {}

    // 사전 검사 사각형 업데이트
    updateCheckSize(angle) {}
}

//module.exports = Shape;