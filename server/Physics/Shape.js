//const Vector2 = require('./Vector2.js');


class Shape {
    constructor(type) {
        this.type = type; // 도형 종류
        this.checkWidth2; // 사전 검사용 콜라이더. 절반
        this.checkHeight2; // 절반
    }

    // 사전 검사 사각형 업데이트
    updateCheckSize(angle) {}
}

//module.exports = Shape;