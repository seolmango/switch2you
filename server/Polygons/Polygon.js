// 말만 다각형이지 사실 볼록 다각형
class Polygon {
    delete() {
        
    }
    
    // 투영시키기 (내적)
    projection(angle) {}

    collision(polygon) {
        // 볼록 다각형 충돌 확인
        line1 = this.projection();
        line2 = polygon.projection();
        if (Math.abs(line1.middle - line2.middle) > line1.half + line2.half) { // 직선에 투영시킨게 닿는지 확인

        }
    }
}

module.exports = Polygon;