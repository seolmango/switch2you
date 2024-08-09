import {drawCircle} from "../Screens/tools/drawCircle";
import {Color_list} from "../data/color_list";
import {checkTouch} from "../Screens/tools/checkTouch";
import {drawLine} from "../Screens/tools/drawLine";

function checkMultiTouch(touchPoint, x, y, etc){
    if(etc.type === 'circle'){
        for(let i=0; i<touchPoint.length; i++){
            if(Math.sqrt(Math.pow(touchPoint[i].x - x, 2) + Math.pow(touchPoint[i].y - y, 2)) < etc.radius){
                return [touchPoint[i].x, touchPoint[i].y];
            }
        }
        return null;
    }else if(etc.type === 'box'){
        for(let i=0; i<touchPoint.length; i++){
            if(checkTouch(touchPoint[i].x, touchPoint[i].y, x, y, etc.width, etc.height)){
                return [touchPoint[i].x, touchPoint[i].y];
            }
        }
        return null;
    }
}

class JoystickController {
    constructor(id) {
        this.joyStickCanvas = document.getElementById(id);
        this.joyStickctx = this.joyStickCanvas.getContext("2d");
        this.touchPoint = [];
        this.click_point = [];
        this.move_direction = 0;
        this.switch_direction = 0;
        this.joyStickCanvas.addEventListener("touchstart", function (e) {
            e.preventDefault();
            this.touchPoint = [];
            for (let i = 0; i < e.touches.length; i++) {
                this.touchPoint.push({ x: e.touches[i].clientX, y: e.touches[i].clientY });
            }
        }.bind(this))
        this.joyStickCanvas.addEventListener("touchmove", function (e) {
            e.preventDefault();
            this.touchPoint = [];
            for (let i = 0; i < e.touches.length; i++) {
                this.touchPoint.push({ x: e.touches[i].clientX, y: e.touches[i].clientY });
            }
        }.bind(this))
        this.joyStickCanvas.addEventListener("touchend", function (e) {
            e.preventDefault();
            for (let i = 0; i < this.touchPoint.length; i++) {
                let exist = false;
                for(let j=0; j< e.touches.length; j++){
                    if(this.touchPoint[i].x === e.touches[j].clientX && this.touchPoint[i].y === e.touches[j].clientY){
                        exist = true;
                    }
                }
                if(!exist) {
                    this.touchPoint.splice(i, 1);
                    this.click_point.push({ x: e.changedTouches[i].clientX, y: e.changedTouches[i].clientY });
                }
            }
        }.bind(this))
    }

    activate() {
        this.joyStickCanvas.style.zIndex = 5;
        this.joyStickCanvas.style.display = "block";
        this.active = true;
    }

    deactivate() {
        this.joyStickCanvas.style.zIndex = -5;
        this.joyStickCanvas.style.display = "none";
        this.active = false;
    }

    draw() {
        this.joyStickctx.clearRect(0, 0, this.joyStickCanvas.width, this.joyStickCanvas.height);
        let move_size = this.joyStickCanvas.height / 2;
        drawCircle(this.joyStickctx, move_size*0.6, this.joyStickCanvas.height-move_size*0.6, move_size*0.5, undefined, Color_list.button_gray_2_hex, 10);
        for(let i=0; i<8; i++){
            let angle = i * 45 * Math.PI / 180;
            drawLine(this.joyStickctx, move_size*0.6 + Math.cos(angle)*move_size*0.5, this.joyStickCanvas.height-move_size*0.6 + Math.sin(angle)*move_size*0.5, move_size*0.6 + Math.cos(angle)*move_size*0.3, this.joyStickCanvas.height-move_size*0.6 + Math.sin(angle)*move_size*0.3, Color_list.button_gray_2_hex, 8);
        }
        let move_touch_point = checkMultiTouch(this.touchPoint, move_size*0.6, this.joyStickCanvas.height-move_size*0.6, {type: 'circle', radius: move_size});
        if(move_touch_point !== null){
            let move_angle = Math.atan2((this.joyStickCanvas.height-move_size*0.6) - move_touch_point[1], move_touch_point[0] - move_size*0.6);
            let move_distance = Math.min(move_size*0.5, Math.sqrt(Math.pow(move_touch_point[0] - move_size*0.6, 2) + Math.pow(move_touch_point[1] - (this.joyStickCanvas.height-move_size*0.6), 2)));
            drawCircle(this.joyStickctx, move_size*0.6 + Math.cos(move_angle)*move_distance, this.joyStickCanvas.height-move_size*0.6 - Math.sin(move_angle)*move_distance, move_size*0.15, Color_list.button_gray_3_hex, undefined, 0);
            move_angle = move_angle * 180 / Math.PI;
            if(move_angle > 0 - 22.5 && move_angle < 0 + 22.5){
                this.move_direction = 1;
            }else if(move_angle > -45 - 22.5 && move_angle < -45 + 22.5){
                this.move_direction = 2;
            }else if(move_angle > -90 - 22.5 && move_angle < -90 + 22.5) {
                this.move_direction = 3;
            }else if(move_angle > -135 - 22.5 && move_angle < -135 + 22.5) {
                this.move_direction = 4;
            }else if(move_angle < -180 + 22.5 || move_angle > 180 - 22.5) {
                this.move_direction = 5;
            }else if(move_angle > 135 - 22.5 && move_angle < 135 + 22.5) {
                this.move_direction = 6;
            }else if(move_angle > 90 - 22.5 && move_angle < 90 + 22.5) {
                this.move_direction = 7;
            }else {
                this.move_direction = 8;
            }
        }else{
            drawCircle(this.joyStickctx, move_size*0.6, this.joyStickCanvas.height-move_size*0.6, move_size*0.15, Color_list.button_gray_3_hex, undefined, 0);
            this.move_direction = 0;
        }
        let switch_size = this.joyStickCanvas.height / 2;
        drawCircle(this.joyStickctx, this.joyStickCanvas.width - switch_size*0.6, this.joyStickCanvas.height-switch_size*0.6, switch_size*0.5, undefined, Color_list.button_gray_2_hex, 10);
        for(let i=0; i<8; i++){
            let angle = i * 45 * Math.PI / 180;
            drawLine(this.joyStickctx, this.joyStickCanvas.width - switch_size*0.6 + Math.cos(angle)*switch_size*0.5, this.joyStickCanvas.height-switch_size*0.6 + Math.sin(angle)*switch_size*0.5, this.joyStickCanvas.width - switch_size*0.6 + Math.cos(angle)*switch_size*0.3, this.joyStickCanvas.height-switch_size*0.6 + Math.sin(angle)*switch_size*0.3, Color_list.button_gray_2_hex, 8);
        }
        let switch_touch_point = checkMultiTouch(this.touchPoint, this.joyStickCanvas.width - switch_size*0.6, this.joyStickCanvas.height-switch_size*0.6, {type: 'circle', radius: switch_size});
        if(switch_touch_point !== null) {
            let switch_angle = Math.atan2((this.joyStickCanvas.height - switch_size * 0.6) - switch_touch_point[1], switch_touch_point[0] - (this.joyStickCanvas.width - switch_size * 0.6));
            let switch_distance = Math.min(switch_size * 0.5, Math.sqrt(Math.pow(switch_touch_point[0] - (this.joyStickCanvas.width - switch_size * 0.6), 2) + Math.pow(switch_touch_point[1] - (this.joyStickCanvas.height - switch_size * 0.6), 2)));
            drawCircle(this.joyStickctx, this.joyStickCanvas.width - switch_size * 0.6 + Math.cos(switch_angle) * switch_distance, this.joyStickCanvas.height - switch_size * 0.6 - Math.sin(switch_angle) * switch_distance, switch_size * 0.15, Color_list.button_gray_3_hex, undefined, 0);
            switch_angle = switch_angle * 180 / Math.PI;
            if (switch_angle > 0 - 22.5 && switch_angle < 0 + 22.5) {
                this.switch_direction = 1;
            } else if (switch_angle > -45 - 22.5 && switch_angle < -45 + 22.5) {
                this.switch_direction = 2;
            } else if (switch_angle > -90 - 22.5 && switch_angle < -90 + 22.5) {
                this.switch_direction = 3;
            } else if (switch_angle > -135 - 22.5 && switch_angle < -135 + 22.5) {
                this.switch_direction = 4;
            } else if (switch_angle < -180 + 22.5 || switch_angle > 180 - 22.5) {
                this.switch_direction = 5;
            } else if (switch_angle > 135 - 22.5 && switch_angle < 135 + 22.5) {
                this.switch_direction = 6;
            } else if (switch_angle > 90 - 22.5 && switch_angle < 90 + 22.5) {
                this.switch_direction = 7;
            } else {
                this.switch_direction = 8;
            }
        }else{
            drawCircle(this.joyStickctx, this.joyStickCanvas.width - switch_size*0.6, this.joyStickCanvas.height-switch_size*0.6, switch_size*0.15, Color_list.button_gray_3_hex, undefined, 0);
            this.switch_direction = 0;
        }
        if(this.switch_direction !== 0){
            let switch_angle = Math.atan2((this.joyStickCanvas.height - switch_size * 0.6) - switch_touch_point[1], switch_touch_point[0] - (this.joyStickCanvas.width - switch_size * 0.6));
            let switch_distance = Math.min(switch_size * 0.5, Math.sqrt(Math.pow(switch_touch_point[0] - (this.joyStickCanvas.width - switch_size * 0.6), 2) + Math.pow(switch_touch_point[1] - (this.joyStickCanvas.height - switch_size * 0.6), 2)));
            for(let i=0; i<8; i++){
                let angle = (i * 45 - 22.5) * Math.PI / 180;
                drawLine(this.joyStickctx, this.joyStickCanvas.width / 2 + Math.cos(angle) * 50,  this.joyStickCanvas.height / 2 + Math.sin(angle) * 50, this.joyStickCanvas.width / 2 + Math.cos(angle) * 100,  this.joyStickCanvas.height / 2 + Math.sin(angle) * 100, Color_list.button_gray_2_hex, 10);
                if(i === this.switch_direction - 1 && switch_distance > switch_size*0.3){
                    drawCircle(this.joyStickctx, this.joyStickCanvas.width / 2 + Math.cos(angle + 22.5 * Math.PI / 180) * 100,  this.joyStickCanvas.height / 2 + Math.sin(angle + 22.5 * Math.PI / 180) * 100, 30, Color_list.player_inside_colors[i], Color_list.player_outside_colors[i], 15);
                }else {
                    drawCircle(this.joyStickctx, this.joyStickCanvas.width / 2 + Math.cos(angle + 22.5 * Math.PI / 180) * 100, this.joyStickCanvas.height / 2 + Math.sin(angle + 22.5 * Math.PI / 180) * 100, 20, Color_list.player_inside_colors[i], Color_list.player_outside_colors[i], 10);
                }
            }
            drawCircle(this.joyStickctx, this.joyStickCanvas.width / 2, this.joyStickCanvas.height / 2, 50, undefined, Color_list.button_gray_2_hex, 10);
            drawCircle(this.joyStickctx, this.joyStickCanvas.width / 2 + 100 * Math.cos(switch_angle) * (switch_distance / (switch_size*0.5)), this.joyStickCanvas.height / 2 - 100 * Math.sin(switch_angle) * (switch_distance / (switch_size*0.5)), 20, Color_list.button_gray_3_hex, undefined, 0);
        }
    }
}

export {JoystickController};