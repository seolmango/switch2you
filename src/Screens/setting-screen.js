const settingScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {Color_list} from "../data/color_list";
import {titleScreen} from "./title-screen";
import {checkTouch} from "./tools/checkTouch";
import {drawRangeSlider} from "./tools/drawRangeSlider";

settingScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    settingScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0, 0, 1920, 1080);
    settingScreen.checkUIList = [];
    settingScreen.checkUIList.push({
        tag: 'setting-screen-back',
        center_x: 180,
        center_y: 72,
        width: 240,
        height: 96,
        clicked: function () {
            Screen.currentScreen = titleScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    });
}

settingScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0, 0, 1920, 1080);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96)){
        drawRoundBox(UI_ctx, 180,72, 240*1.05, 96*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 180,72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 180,72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180,72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }

    drawRangeSlider(UI_ctx, 960, 540, {
        lenght: 1200,
        color: Color_list.button_gray_2_hex,
        width: 10,
    }, {
        radius: 30,
        color: Color_list.button_gray_2_hex,
        stroke_color: Color_list.button_gray_3_hex,
        stroke_width: 10,
    }, 0, 100, Screen.Settings.Sound.BGM);
}

settingScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0, 0, 1920, 1080);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Settings", "center", "GmarketSansMedium");
}

settingScreen.check = function (userMouse, userKeyboard, checkUIList) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height)) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
};

export {settingScreen};