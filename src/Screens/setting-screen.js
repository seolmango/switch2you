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
    settingScreen.checkUIList.push({
        tag: 'setting-screen-sound-page',
        center_x: 320,
        center_y: 990,
        width: 400,
        height: 120,
        clicked: function () {
            settingScreen.page = "Sound";
        }
    });
    settingScreen.checkUIList.push({
        tag: 'setting-screen-game-page',
        center_x: 960,
        center_y: 990,
        width: 400,
        height: 120,
        clicked: function () {
            settingScreen.page = "Game";
        }
    });
    settingScreen.checkUIList.push({
        tag: 'setting-screen-graphics-page',
        center_x: 1600,
        center_y: 990,
        width: 400,
        height: 120,
        clicked: function () {
            settingScreen.page = "Graphics";
        }
    });
    settingScreen.checkUIList.push({
        tag: 'setting-screen-bgm-slider',
        center_x: 960,
        center_y: 400,
        width: 1250,
        height: 100,
        clicked: function () {
            if(settingScreen.page === 'Sound') {
                Screen.Settings.Sound.BGM = Math.round((Screen.userMouse.x - 960 + 600) / 1200 * 100);
                Screen.Settings.Sound.BGM = Math.max(0, Screen.Settings.Sound.BGM);
                Screen.Settings.Sound.BGM = Math.min(100, Screen.Settings.Sound.BGM);
            }
        }
    });
    settingScreen.page = 'Sound';
    settingScreen.settings = Screen.Settings;
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
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 320, 990, 400, 120)){
        drawRoundBox(UI_ctx, 320,990, 400*1.05, 120*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 320,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Sound", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 320,990, 400, 120, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 320,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Sound", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 990, 400, 120)){
        drawRoundBox(UI_ctx, 960,990, 400*1.05, 120*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 960,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Game", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 960,990, 400, 120, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 960,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Game", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1600, 990, 400, 120)){
        drawRoundBox(UI_ctx, 1600,990, 400*1.05, 120*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 1600,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Graphics", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1600,990, 400, 120, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1600,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Graphics", "center", "GmarketSansMedium");
    }
    if(settingScreen.page === 'Sound'){
        drawText(UI_ctx, 960, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "Sound", "center", "GmarketSansMedium");
        drawText(UI_ctx, 960, 300, 60, 0, Color_list.text_default_hex, undefined, undefined, `BGM : ${Screen.Settings.Sound.BGM}`, "center", "GmarketSansMedium");
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 400, 1400, 100)){
            drawRangeSlider(UI_ctx, 960, 400, {
                lenght: 1200,
                color: Color_list.button_gray_2_hex,
                width: 10,
            }, {
                radius: 40,
                color: Color_list.button_gray_2_hex,
                stroke_color: Color_list.button_gray_3_hex,
                stroke_width: 10,
            }, 0, 100, Screen.Settings.Sound.BGM);
        }else {
            drawRangeSlider(UI_ctx, 960, 400, {
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
    }else if(settingScreen.page === 'Game'){
        drawText(UI_ctx, 960, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "Game", "center", "GmarketSansMedium");
    }else{
        drawText(UI_ctx, 960, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "Graphics", "center", "GmarketSansMedium");
    }
}

settingScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0, 0, 1920, 1080);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Settings", "center", "GmarketSansMedium");
    drawRoundBox(Background_ctx, 960, 520, 1600, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 50);
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
    if(userMouse.press === true) {
        if(checkTouch(userMouse.x, userMouse.y, 960, 400, 1400, 100)){
            checkUIList[4].clicked();
        }
    }
    BGM_Player.setVolume(settingScreen.settings.Sound.BGM);
};

export {settingScreen};