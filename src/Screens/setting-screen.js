const settingScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {Color_list} from "../data/color_list";
import {titleScreen} from "./title-screen";
import {checkTouch} from "./tools/checkTouch";
import {drawRangeSlider} from "./tools/drawRangeSlider";
import {clearCtx} from "./tools/clearCtx";

settingScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    settingScreen.redrawBackground(Background_ctx);
    clearCtx(UI_ctx);
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
            settingScreen.page = "Display";
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
                Screen.Settings.Sound.BGM = Math.round(((Screen.userMouse.x / UI_ctx.displayDPI) - 960 + 600) / 1200 * 100);
                Screen.Settings.Sound.BGM = Math.max(0, Screen.Settings.Sound.BGM);
                Screen.Settings.Sound.BGM = Math.min(100, Screen.Settings.Sound.BGM);
            }
        }
    });
    settingScreen.checkUIList.push({
        tag: 'setting-screen-fps-slider',
        center_x: 960,
        center_y: 400,
        width: 1250,
        height: 100,
        clicked: function () {
            if(settingScreen.page === 'Display') {
                settingScreen.new[0] = Math.round(((Screen.userMouse.x / UI_ctx.displayDPI) - 960 + 600) / 1200 * 270 + 30);
                settingScreen.new[0] = Math.max(30, settingScreen.new[0]);
                settingScreen.new[0] = Math.min(300, settingScreen.new[0]);
            }
        }
    })
    settingScreen.checkUIList.push({
        tag: 'setting-screen-fps-submit',
        center_x: 1200,
        center_y: 300,
        width: 80,
        height: 80,
        clicked: function () {
            if(settingScreen.page === 'Display') {
                Screen.Settings.Display.fps = settingScreen.new[0];
                clearInterval(Screen.display_interval)
                Screen.display_interval = setInterval( function () {
                    if(Screen.joyStickController.active) {
                        Screen.joyStickController.draw();
                    }
                    Screen.currentScreen.draw(Background_ctx, UI_ctx, Screen);
                    Screen.alert.draw();
                    Screen.currentScreen.check(Screen.userMouse, Screen.userKeyboard, Screen.currentScreen.checkUIList, UI_ctx.displayDPI);
                }, (1000 / Screen.Settings.Display.fps));
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                Screen.currentScreen.page = 'Display';
            }
        }
    })
    settingScreen.checkUIList.push({
        tag: 'setting-screen-fps-reset',
        center_x: 1310,
        center_y: 300,
        width: 80,
        height: 80,
        clicked: function () {
            if(settingScreen.page === 'Display') {
                settingScreen.new[0] = settingScreen.before[0];
            }
        }
    })
    settingScreen.checkUIList.push({
        tag: 'setting-screen-fullscreen',
        center_x: 1360,
        center_y: 500,
        width: 720,
        height: 100,
        clicked: function () {
            if(settingScreen.page === 'Display') {
                let isInFullScreen = (document.fullscreenElement && true) || (document.webkitFullscreenElement && true) || (document.mozFullScreenElement && true) || (document.msFullscreenElement && true);
                if(!isInFullScreen){
                    const container = document.documentElement;
                    if (container.requestFullscreen) {
                        container.requestFullscreen();
                    } else if (container.webkitRequestFullscreen) {
                        container.webkitRequestFullscreen();
                    } else if (container.mozRequestFullscreen) {
                        container.mozRequestFullscreen();
                    } else if (container.msRequestFullscreen) {
                        container.msRequestFullscreen();
                    } else {
                        console.log("Fullscreen API is not supported.");
                    }
                }else {
                    const container = document;
                    if (container.exitFullscreen) {
                        container.exitFullscreen();
                    } else if (container.webkitCancelFullscreen) {
                        container.webkitCancelFullscreen();
                    } else if (container.mozCancelFullscreen) {
                        container.mozCancelFullscreen();
                    } else if (container.msExitFullscreen) {
                        container.msExitFullscreen();
                    } else {
                        console.log("Fullscreen API is not supported.");
                    }
                }
            }
        }
    })
    settingScreen.page = 'Sound';
    settingScreen.settings = Screen.Settings;
    settingScreen.before = [Screen.Settings.Display.fps];
    settingScreen.new = [Screen.Settings.Display.fps];
}

settingScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    clearCtx(UI_ctx);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 180,72, 240*1.05, 96*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 180,72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 180,72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180,72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 320, 990, 400, 120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 320,990, 400*1.05, 120*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 320,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Sound", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 320,990, 400, 120, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 320,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Sound", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 990, 400, 120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 960,990, 400*1.05, 120*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 960,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Game", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 960,990, 400, 120, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 960,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Game", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1600, 990, 400, 120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 1600,990, 400*1.05, 120*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 1600,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Display", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1600,990, 400, 120, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1600,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Display", "center", "GmarketSansMedium");
    }
    if(settingScreen.page === 'Sound'){
        drawText(UI_ctx, 960, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "Sound", "center", "GmarketSansMedium");
        drawText(UI_ctx, 960, 300, 60, 0, Color_list.text_default_hex, undefined, undefined, `BGM : ${Screen.Settings.Sound.BGM}`, "center", "GmarketSansMedium");
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 400, 1400, 100, UI_ctx.displayDPI)){
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
        drawText(UI_ctx, 960, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "Display", "center", "GmarketSansMedium");
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1200, 300, 80, 80, UI_ctx.displayDPI)){
            drawRoundBox(UI_ctx, 1200, 300, 80*1.05, 80*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 1200, 300, 50*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "✔", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 1200, 300, 80, 80, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
            drawText(UI_ctx, 1200, 300, 50, 0, Color_list.text_default_hex, undefined, undefined, "✔", "center", "GmarketSansMedium");
        }
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1310, 300, 80, 80, UI_ctx.displayDPI)){
            drawRoundBox(UI_ctx, 1310, 300, 80*1.05, 80*1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 1310, 300, 50*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "↺", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 1310, 300, 80, 80, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
            drawText(UI_ctx, 1310, 300, 50, 0, Color_list.text_default_hex, undefined, undefined, "↺", "center", "GmarketSansMedium");
        }
        drawText(UI_ctx, 960, 300, 60, 0, (settingScreen.before[0] === settingScreen.new[0]) ? Color_list.text_default_hex : Color_list.button_blue_2_hex, undefined, undefined, `FPS : ${settingScreen.new[0]}`, "center", "GmarketSansMedium");
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 400, 1400, 100, UI_ctx.displayDPI)){
            drawRangeSlider(UI_ctx, 960, 400, {
                lenght: 1200,
                color: Color_list.button_gray_2_hex,
                width: 10,
            }, {
                radius: 40,
                color: Color_list.button_gray_2_hex,
                stroke_color: Color_list.button_gray_3_hex,
                stroke_width: 10,
            }, 30, 300, settingScreen.new[0]);
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
            }, 30, 300, settingScreen.new[0]);
        }
        drawText(UI_ctx, 200, 500, 60, 0, Color_list.text_default_hex, undefined, undefined, "Change Screen Mode > ", "left", "GmarketSansMedium")
        let isInFullScreen = (document.fullscreenElement && true) || (document.webkitFullscreenElement && true) || (document.mozFullScreenElement && true) || (document.msFullscreenElement && true);
        if(!isInFullScreen){
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1360, 500, 720, 100, UI_ctx.displayDPI)){
                drawRoundBox(UI_ctx, 1360, 500, 720*1.05, 100*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
                drawText(UI_ctx, 1360, 500, 50*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Enter FullScreen", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 1360, 500, 720, 100, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
                drawText(UI_ctx, 1360, 500, 50, 0, Color_list.text_default_hex, undefined, undefined, "Enter FullScreen", "center", "GmarketSansMedium");
            }
        }else{
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1360, 500, 720, 100, UI_ctx.displayDPI)){
                drawRoundBox(UI_ctx, 1360, 500, 720*1.05, 100*1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10*1.05, 25*1.05);
                drawText(UI_ctx, 1360, 500, 50*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Exit FullScreen", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 1360, 500, 720, 100, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
                drawText(UI_ctx, 1360, 500, 50, 0, Color_list.text_default_hex, undefined, undefined, "Exit FullScreen", "center", "GmarketSansMedium");
            }
        }
    }
}

settingScreen.redrawBackground = function (Background_ctx) {
    clearCtx(Background_ctx);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Settings", "center", "GmarketSansMedium");
    drawRoundBox(Background_ctx, 960, 520, 1600, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 50);
}

settingScreen.check = function (userMouse, userKeyboard, checkUIList, DPI) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height, DPI)) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
    if(userMouse.press === true) {
        if(checkTouch(userMouse.x, userMouse.y, 960, 400, 1400, 100, DPI)){
            checkUIList[4].clicked();
            checkUIList[5].clicked();
        }
    }
    BGM_Player.setVolume(settingScreen.settings.Sound.BGM);
};

export {settingScreen};