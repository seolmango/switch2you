const waitingRoomScreen = {};
import {Color_list} from "../data/color_list";
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {checkTouch} from "./tools/checkTouch";
import {viewServerListScreen} from "./view-server-list-screen";
import {drawCircle} from "./tools/drawCircle";
import {drawLine} from "./tools/drawLine";

waitingRoomScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    waitingRoomScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0, 0, 1920, 1080);
    waitingRoomScreen.checkUIList = [];
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-back',
        center_x: 180,
        center_y: 72,
        width: 240,
        height: 96,
        clicked: function () {
            Screen.currentScreen = viewServerListScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    });
}

waitingRoomScreen.draw = function(Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0, 0, 1920, 1080);
    if (checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96)) {
        drawRoundBox(UI_ctx, 180, 72, 240 * 1.05, 96 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 180, 72, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    } else {
        drawRoundBox(UI_ctx, 180, 72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180, 72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }
}

waitingRoomScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0, 0, 1920, 1080);
}

waitingRoomScreen.check = function (userMouse, userKeyboard, checkUIList){
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height)) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
}

export {waitingRoomScreen};