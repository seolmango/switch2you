const connectingSocketScreen = {};
import {Color_list} from "../data/color_list";
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {drawCircle} from "./tools/drawCircle";
import { io } from 'socket.io-client';

connectingSocketScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    connectingSocketScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0,0,1920,1080);
    connectingSocketScreen.checkUIList = [];
    window.dispatchEvent(new CustomEvent("doSocketConnect"));
};

connectingSocketScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    let second = new Date().getSeconds();
    let millisecond = new Date().getMilliseconds();
    UI_ctx.clearRect(0,0,1920,1080);
    drawRoundBox(UI_ctx, 960, 540, 1600, 900, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 20, 50)
    drawText(UI_ctx,960, 400, 70, 0, Color_list.button_gray_3_hex, undefined, undefined, "connecting to server" + ".".repeat((second%3)+1), "center", 'GmarketSansMedium');
    let rad_delta = 2 * Math.PI * (millisecond / 1000);
    let rads = [rad_delta, 2*Math.PI/5+rad_delta, 4*Math.PI/5+rad_delta, 6*Math.PI/5+rad_delta, 8*Math.PI/5+rad_delta];
    for (let i = 0; i < 5; i++) {
        drawCircle(UI_ctx, 960 + 70 * Math.cos(rads[i]), 680 + 70 * Math.sin(rads[i]), 10, Color_list.button_gray_3_hex, undefined, undefined);
    }
};

connectingSocketScreen.check = function (userMouse, userKeyboard, checkUIList) {
};

connectingSocketScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0,0,1920,1080);
};

export {connectingSocketScreen};