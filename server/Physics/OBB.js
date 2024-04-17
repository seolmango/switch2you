//const Vector2 = require('./Vector2.js');
//const Convex = require('./Convex.js');


class OBB extends Convex {
    constructor(width, height) {
        super([new Vector2(width * 0.5, height * 0.5), new Vector2(-width * 0.5, height * 0.5), new Vector2(-width * 0.5, -height * 0.5), new Vector2(width * 0.5, -height * 0.5)]);
        this.width2 = width * 0.5; // 절반
        this.height2 = height * 0.5; // 절반
    }

    getArea() {
        return this.width2 * this.height2 * 4;
    }

    /** 최적화를 위한 오버라이드 나중에
    updateCheckSize(angle) {
        const CosR = Math.abs(Math.cos(angle));
        const SinR = Math.abs(Math.sin(angle));
        const axisVector = new Vector2(CosR * this.width2, SinR * this.width2); // 오른쪽으로의 거리
        const plusVector = new Vector2(-SinR * this.height2, CosR * this.height2); // 거기서 위 아래로의 거리
        this.checkWidth2 = axisVector.minus(plusVector).x;
        this.checkHeight2 = axisVector.plus(plusVector).y;
    }*/

    /** 최적화를 위한 오버라이드 나중에
    getPoints(angle) {
        return [this.width2];
    }*/

    /** 최적화를 위한 오버라이드 나중에
    getNormals(angle) {
        return [new Vector2(Math.cos(angle), Math.sin(angle)), new Vector2(-Math.sin(angle), Math.cos(angle))]
    }*/
}

//module.exports = OBB;