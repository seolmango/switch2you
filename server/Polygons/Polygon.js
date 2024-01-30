// 말만 다각형이지 사실 볼록 다각형
class Polygon {
    constructor(type, pos) {
        this.type = type;
        this.pos = pos;
    }

    delete() {
        
    }

    // 충돌 검사를 위한 단위벡터 반환
    get unitVector() {}
    
    // 투영시키기 (내적)
    projection(angle) {}

    collisionCheck(polygon) {
        // 볼록 다각형, 원 충돌 확인
        // OBB 참고: https://justicehui.github.io/other-algorithm/2018/06/23/OBB/
        if (this.type === "OBB" && polygon.type === "OBB") {
            let check = true;
            const unitVectors = [...this.unitVector, ...polygon.unitVector]; // 투영시켜야 하는 단위 벡터를 모두 받는다.
            for (let unitVector of unitVectors) {
                let line1 = this.projection(unitVector);
                let line2 = polygon.projection(unitVector);
                if (Math.abs(this.pos.minus(polygon.pos).innerProduct(unitVector)) >= line1 + line2) // 직선에 투영시킨게 안닿는지 확인
                    check = false;
            }

            if (check) { // 닿음
                // 닿는 코드 작성
            }
            return check;
        } else if (this.type === "Circle" && polygon.type === "Circle") {
            const check = Math.abs(this.pos.minus(polygon.pos).magnitude) < this.radius + polygon.radius;
            return check;
        }
    }
}

module.exports = Polygon;