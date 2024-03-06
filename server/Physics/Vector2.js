class Vector2 {
    constructor(x = 0, y = 0) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(vector2) {
        return new Vector2(this.x + vector2.x, this.y + vector2.y);
    }

    minus(vector2) {
        return new Vector2(this.x - vector2.x, this.y - vector2.y);
    }

    multiply(number) {
        return new Vector2(this.x * number, this.y * number);
    }

    divide(number) {
        return new Vector2(this.x / number, this.y / number);
    }

    // 길이
    get magnitude () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // 단위벡터 반환
    normalize() {
        return new Vector2(this.x / this.magnitude, this.y / this.magnitude);
    }

    // 사이각
    getContainedAngle(vector2) { // 각 계산은 모두 라디안 (이게 편함)
        const angle1 = Math.atan2(this.y, this.x);
        const angle2 = Math.atan2(vector2.y, vector2.x);
        if (angle1 > angle2) return angle1 - angle2;
        else return angle2 - angle1;
    }

    // 내적
    innerProduct(vector2) {
        return Math.cos(this.getContainedAngle(vector2)) * this.magnitude * vector2.magnitude;
    }

    // 외적
    outerProduct(vector2) {
        return Math.sin(this.getContainedAngle(vector2)) * this.magnitude * vector2.magnitude;
    }
}

//module.exports = Vector2;