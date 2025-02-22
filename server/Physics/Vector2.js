class Vector2 {
    constructor(x = 0, y = 0) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    deepCopy() {
        return new Vector2(this.x, this.y);
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
        if (this.magnitude === 0) return new Vector2(0, 0);
        return new Vector2(this.x / this.magnitude, this.y / this.magnitude);
    }

    // 내적
    dot(vector2) {
        return this.x * vector2.x + this.y * vector2.y;
    }

    // 외적
    cross(vector2) {
        return this.x * vector2.y - this.y * vector2.x;
    }

    // 회전변환
    rotationConversion(angle) {
        return new Vector2(Math.cos(angle) * this.x - Math.sin(angle) * this.y, Math.sin(angle) * this.x + Math.cos(angle) * this.y);
    }
}

module.exports = Vector2;