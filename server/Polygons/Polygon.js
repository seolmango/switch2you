const Vector2 = require('./Vector2.js');


// 말만 다각형이지 사실 볼록 다각형
class Polygon {
    #_rotation; // 회전량. 먼저 정의 해버리면 값이 꼬여버림

    constructor(type, pos) {
        this.type = type; // 도형 종류
        this.pos = pos; // 중심
        this.velocity = 0; // 속도
        this.checkWidth2; // 절반
        this.checkHeight2; // 절반
    }

    delete() {
        
    }

    get rotation() {
        return this.#_rotation;
    }

    // 회전량 변경
    set rotation(value) {
        this.#_rotation = value;
        this.updateCheckSize();
    }

    // 충돌 검사를 위한 단위벡터 반환
    get unitVector() {}

    // 사전 검사 사각형 업데이트
    updateCheckSize() {}
    
    // 투영시키기 (내적)
    projection(angle) {}

    collisionCheck(polygon) {
        // 사전 충돌 검사
        if ((this.pos.x + polygon.pos.x > this.checkWidth2 + polygon.checkWidth2) || (this.pos.y + polygon.pos.y > this.checkheight2 + polygon.checkHeight2))
            return false;
        // 직사각형, 원 충돌 확인
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
        } else if ((this.type === "Circle" && polygon.type === "OBB") || (polygon.type === "Circle" && this.type === "OBB")) {
            let circle, obb;
            if (this.type === "Circle") {
                circle = this;
                obb = polygon;
            } else {
                circle = polygon;
                obb = this;
            }
            // OBB를 중점으로 좌표계 회전 후, Circle-AABB 감지
            let dpos = circle.pos.minus(obb.pos)
            let drotation = Math.atan2(dpos.y, dpos.x) - obb.rotation;
            dpos = new Vector2(Math.cos(drotation) * dpos.magnitude, Math.sin(drotation) * dpos.magnitude);
            let x, y;
            // Circle-OBB 의 최단점 찾기
            if (dpos.x > obb.pos.x + obb.width2) x = obb.pos.x + obb.width2;
            else if (dpos.x < obb.pos.x - obb.width2) x = obb.pos.x - obb.width2;
            else x = dpos.x;
            if (dpos.y > obb.pos.y + obb.height2) y = obb.pos.y + obb.height2;
            else if (dpos.y < obb.pos.y - obb.height2) y = obb.pos.y - obb.height2;
            else y = dpos.y;
            const check = dpos.minus(new Vector2(x, y)) < circle.radius;
            
            return check;
        }
    }
}

module.exports = Polygon;