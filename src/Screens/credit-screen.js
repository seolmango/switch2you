const creditScreen = {};
import {Color_list} from "../data/color_list";
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {checkTouch} from "./tools/checkTouch";
import {titleScreen} from "./title-screen";
import {image} from "../data/image";
import {drawCircleImage} from "./tools/drawCircleImage";
import {clearCtx} from "./tools/clearCtx";

creditScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    if(typeof(history.pushState) != 'undefined'){
        let url = new URL(window.location.href);
        let urlParams = url.searchParams;
        urlParams.set('page', 'credit');
        history.pushState(null, null, url);
    }
    creditScreen.redrawBackground(Background_ctx);
    clearCtx(UI_ctx);
    creditScreen.checkUIList = [];
    creditScreen.checkUIList.push({
        tag: 'credit-screen-back',
        center_x: 180,
        center_y: 72,
        width: 240,
        height: 96,
        clicked: function () {
            Screen.currentScreen = titleScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    });
    creditScreen.checkUIList.push({
        tag: 'credit-screen-see-source-code',
        center_x: 480,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            window.open('https://github.com/seolmango/switch2you', 'switch2you-code');
        }
    });
    creditScreen.checkUIList.push({
        tag: 'credit-screen-listen-soundtrack',
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            window.open('https://soundcloud.com/hraverals/switchover', 'switch2you-soundtrack');
        }
    });
    creditScreen.checkUIList.push({
        tag: 'credit-screen-seolmango',
        center_x: 410,
        center_y: 520,
        width: 500,
        height: 760,
        clicked: function () {
            window.open('https://github.com/seolmango', 'seolmango-github');
        }
    });
    creditScreen.checkUIList.push({
        tag: 'credit-screen-mossy',
        center_x: 960,
        center_y: 520,
        width: 500,
        height: 760,
        clicked: function () {
            window.open('https://github.com/Mossygoldcoin', 'mossy-github');
        }
    });
    creditScreen.checkUIList.push({
        tag: 'credit-screen-H',
        center_x: 1510,
        center_y: 520,
        width: 500,
        height: 760,
        clicked: function () {
            window.open('https://soundcloud.com/hraverals', 'H-soundcloud');
        }
    });
}

creditScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    clearCtx(UI_ctx);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 180,72, 240*1.05, 96*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 180,72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 180,72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180,72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 480, 990, 720, 120, UI_ctx.displayDPI)) {
        drawRoundBox(UI_ctx, 480, 990, 720 * 1.05, 120 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 480, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "See source code", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 480, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
        drawText(UI_ctx, 480, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "See source code", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120, UI_ctx.displayDPI)) {
        drawRoundBox(UI_ctx, 1440, 990, 720 * 1.05, 120 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 1440, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Listen soundtrack", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1440, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
        drawText(UI_ctx, 1440, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Listen soundtrack", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 410, 520, 500, 760, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 410, 520, 500*1.05, 700*1.05, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10*1.05, 25*1.05);
        drawCircleImage(UI_ctx, image.credit_seolmango, 410, 390, 200*1.05);
        drawText(UI_ctx, 410, 650, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Seolmango", "center", "GmarketSansMedium");
        drawText(UI_ctx, 410, 730, 50*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Develop-Web", "center", "GmarketSansMedium");
        drawText(UI_ctx, 410, 810, 40*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Click to visit Github", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 410, 520, 500, 700, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawCircleImage(UI_ctx, image.credit_seolmango, 410, 390, 200);
        drawText(UI_ctx, 410, 650, 60, 0, Color_list.text_default_hex, undefined, undefined, "Seolmango", "center", "GmarketSansMedium");
        drawText(UI_ctx, 410, 730, 50, 0, Color_list.text_default_hex, undefined, undefined, "Develop-Web", "center", "GmarketSansMedium");
        drawText(UI_ctx, 410, 810, 40, 0, Color_list.text_default_hex, undefined, undefined, "Click to visit Github", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 520, 500, 760, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 960, 520, 500*1.05, 700*1.05, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10*1.05, 25*1.05);
        drawCircleImage(UI_ctx, image.credit_mossy, 960, 390, 200*1.05);
        drawText(UI_ctx, 960, 650, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "이끼낀금화", "center", "GmarketSansMedium");
        drawText(UI_ctx, 960, 730, 50*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Develop-Server", "center", "GmarketSansMedium");
        drawText(UI_ctx, 960, 810, 40*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Click to visit Github", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 960, 520, 500, 700, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawCircleImage(UI_ctx, image.credit_mossy, 960, 390, 200);
        drawText(UI_ctx, 960, 650, 60, 0, Color_list.text_default_hex, undefined, undefined, "이끼낀금화", "center", "GmarketSansMedium");
        drawText(UI_ctx, 960, 730, 50, 0, Color_list.text_default_hex, undefined, undefined, "Develop-Server", "center", "GmarketSansMedium");
        drawText(UI_ctx, 960, 810, 40, 0, Color_list.text_default_hex, undefined, undefined, "Click to visit Github", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1510, 520, 500, 760, UI_ctx.displayDPI)) {
        drawRoundBox(UI_ctx, 1510, 520, 500 * 1.05, 700 * 1.05, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10 * 1.05, 25 * 1.05);
        drawCircleImage(UI_ctx, image.credit_H, 1510, 390, 200 * 1.05);
        drawText(UI_ctx, 1510, 650, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "H", "center", "GmarketSansMedium");
        drawText(UI_ctx, 1510, 730, 50 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Artist-sound", "center", "GmarketSansMedium");
        drawText(UI_ctx, 1510, 810, 32 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Click to visit SoundCloud", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1510, 520, 500, 700, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawCircleImage(UI_ctx, image.credit_H, 1510, 390, 200);
        drawText(UI_ctx, 1510, 650, 60, 0, Color_list.text_default_hex, undefined, undefined, "H", "center", "GmarketSansMedium");
        drawText(UI_ctx, 1510, 730, 50, 0, Color_list.text_default_hex, undefined, undefined, "Artist-sound", "center", "GmarketSansMedium");
        drawText(UI_ctx, 1510, 810, 32, 0, Color_list.text_default_hex, undefined, undefined, "Click to visit SoundCloud", "center", "GmarketSansMedium");
    }
}

creditScreen.redrawBackground = function (Background_ctx) {
    clearCtx(Background_ctx);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Credits", "center", "GmarketSansMedium");
}

creditScreen.check = function (userMouse, userKeyboard, checkUIList, DPI){
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height, DPI)) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
}

export {creditScreen};