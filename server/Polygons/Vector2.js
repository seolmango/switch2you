class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(vector2) {
        return new Vector2(this.x + vector2.x, this.y + vector2.y);
    }

    // 길이
    get magnitude () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // 사이각
    getContainedAngle(vector2) { // 각 계산은 모두 라디안 (이게 편함)
        const angle1 = Math.atan(this.x, this.y);
        const angle2 = Math.atan(vector2.x, vector2.y);
        if (angle1 > angle2) return angle1 - angle2;
        else return angle2 - angle1;
    }

    // 내적
    innerProduct(vector2) {
        return new Vector2(Math.cos(getContainedAngle) * this.magnitude * vector2.magnitude);
    }

    // 외적
    outerProduct(vector2) {
        return new Vector2(Math.sin(getContainedAngle) * this.magnitude * vector2.magnitude);
    }
}