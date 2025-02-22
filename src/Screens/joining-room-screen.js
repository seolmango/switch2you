
const joiningRoomScreen = {};
import {Color_list} from "../data/color_list";
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {drawCircle} from "./tools/drawCircle";
import {clearCtx} from "./tools/clearCtx";

joiningRoomScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    joiningRoomScreen.redrawBackground(Background_ctx);
    clearCtx(UI_ctx);
    joiningRoomScreen.checkUIList = [];
}

joiningRoomScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    let second = new Date().getSeconds();
    let millisecond = new Date().getMilliseconds();
    clearCtx(UI_ctx);
    drawRoundBox(UI_ctx, 960, 540, 1600, 900, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 20, 50)
    drawText(UI_ctx,960, 400, 70, 0, Color_list.button_gray_3_hex, undefined, undefined, "joining room" + ".".repeat((second%3)+1), "center", 'GmarketSansMedium');
    let rad_delta = 2 * Math.PI * (millisecond / 1000);
    let rads = [rad_delta, 2*Math.PI/5+rad_delta, 4*Math.PI/5+rad_delta, 6*Math.PI/5+rad_delta, 8*Math.PI/5+rad_delta];
    for (let i = 0; i < 5; i++) {
        drawCircle(UI_ctx, 960 + 70 * Math.cos(rads[i]), 680 + 70 * Math.sin(rads[i]), 10, Color_list.button_gray_3_hex, undefined, undefined);
    }
}

joiningRoomScreen.check = function (userMouse, userKeyboard, checkUIList, DPI) {
}

joiningRoomScreen.redrawBackground = function (Background_ctx) {
    clearCtx(Background_ctx);
}

export {joiningRoomScreen};