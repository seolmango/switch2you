const howToPlayScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {checkTouch} from "./tools/checkTouch";
import {drawCircle} from "./tools/drawCircle";
import {drawLine} from "./tools/drawLine";
import {Color_list} from "../data/color_list"

import {titleScreen} from "./title-screen";

howToPlayScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    howToPlayScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0,0,1920,1080);
    howToPlayScreen.checkUIList = [];
    howToPlayScreen.checkUIList.push({
        tag: 'how-to-play-screen-back',
        center_x: 180,
        center_y: 72,
        width: 240,
        height: 96,
        clicked: function () {
            Screen.currentScreen = titleScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    });
    howToPlayScreen.dragScreen_delta = -550;
    howToPlayScreen.dragScreen_delta_before = -550;
    howToPlayScreen.dragScreen_start_x = 0;
    howToPlayScreen.dragScreen_start = false;
};

howToPlayScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0,0,1920,1080);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96)){
        drawRoundBox(UI_ctx, 180,72, 240*1.05, 96*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 180,72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 180,72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180,72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }
    /*if(checkTouch(Screen.userMouse.x + howToPlayScreen.dragScreen_delta, Screen.userMouse.y, 410, 520, 500, 760)) {
        drawRoundBox(UI_ctx, 410-howToPlayScreen.dragScreen_delta, 520, 500*1.05, 760*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
    }else{
        drawRoundBox(UI_ctx, 410-howToPlayScreen.dragScreen_delta, 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(checkTouch(Screen.userMouse.x + howToPlayScreen.dragScreen_delta, Screen.userMouse.y, 960, 520, 500, 760)) {
        drawRoundBox(UI_ctx, 960-howToPlayScreen.dragScreen_delta, 520, 500*1.05, 760*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
    }else{
        drawRoundBox(UI_ctx, 960-howToPlayScreen.dragScreen_delta, 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(checkTouch(Screen.userMouse.x + howToPlayScreen.dragScreen_delta, Screen.userMouse.y, 1510, 520, 500, 760)) {
        drawRoundBox(UI_ctx, 1510-howToPlayScreen.dragScreen_delta, 520, 500*1.05, 760*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
    }else{
        drawRoundBox(UI_ctx, 1510-howToPlayScreen.dragScreen_delta, 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(checkTouch(Screen.userMouse.x + howToPlayScreen.dragScreen_delta, Screen.userMouse.y, 2060, 520, 500, 760)) {
        drawRoundBox(UI_ctx, 2060-howToPlayScreen.dragScreen_delta, 520, 500*1.05, 760*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
    }else{
        drawRoundBox(UI_ctx, 2060-howToPlayScreen.dragScreen_delta, 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(checkTouch(Screen.userMouse.x + howToPlayScreen.dragScreen_delta, Screen.userMouse.y, 2610, 520, 500, 760)) {
        drawRoundBox(UI_ctx, 2610-howToPlayScreen.dragScreen_delta, 520, 500*1.05, 760*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
    }else{
        drawRoundBox(UI_ctx, 2610-howToPlayScreen.dragScreen_delta, 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }*/
    let activate = 0;
    if(howToPlayScreen.dragScreen_delta >= -550 && howToPlayScreen.dragScreen_delta <= -350){
        activate = 1
    }else if(howToPlayScreen.dragScreen_delta > -350 && howToPlayScreen.dragScreen_delta < -200){
        activate = 1 + (howToPlayScreen.dragScreen_delta + 350) / 150
    }else if(howToPlayScreen.dragScreen_delta >= -200 && howToPlayScreen.dragScreen_delta <= 200){
        activate = 2
    }else if(howToPlayScreen.dragScreen_delta > 200 && howToPlayScreen.dragScreen_delta < 350){
        activate = 2 + (howToPlayScreen.dragScreen_delta - 200) / 150
    }else if(howToPlayScreen.dragScreen_delta >= 350 && howToPlayScreen.dragScreen_delta <= 750){
        activate = 3
    }else if(howToPlayScreen.dragScreen_delta > 750 && howToPlayScreen.dragScreen_delta < 900){
        activate = 3 + (howToPlayScreen.dragScreen_delta - 750) / 150
    }else if(howToPlayScreen.dragScreen_delta >= 900 && howToPlayScreen.dragScreen_delta <= 1300){
        activate = 4
    }else if(howToPlayScreen.dragScreen_delta > 1300 && howToPlayScreen.dragScreen_delta < 1450){
        activate = 4 + (howToPlayScreen.dragScreen_delta - 1300) / 150
    }else if(howToPlayScreen.dragScreen_delta >= 1450 && howToPlayScreen.dragScreen_delta <= 1650){
        activate = 5
    }
    for(let i=1; i<=5; i++){
        if(i === activate){
            drawCircle(UI_ctx, 840 + (i*40), 990, 20, Color_list.button_gray_3_hex, undefined, undefined);
        }else{
            drawCircle(UI_ctx, 840 + (i*40), 990, 10, Color_list.button_gray_1_hex, undefined, undefined);
        }
    }
    if(activate >= 1 && activate < 1.5){
        drawRoundBox(UI_ctx, 410-howToPlayScreen.dragScreen_delta, 520, 1000-(1000 * (activate % 1)), 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }else{
        drawRoundBox(UI_ctx, 410-howToPlayScreen.dragScreen_delta-(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))), 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(activate >= 1.5 && activate < 2.5){
        drawRoundBox(UI_ctx, 960-howToPlayScreen.dragScreen_delta, 520, 1000-(1000 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)), 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }else{
        drawRoundBox(UI_ctx, 960-howToPlayScreen.dragScreen_delta-(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))) * ((activate > 2) ? 1 : -1), 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(activate >= 2.5 && activate < 3.5){
        drawRoundBox(UI_ctx, 1510-howToPlayScreen.dragScreen_delta, 520, 1000-(1000 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)), 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }else{
        drawRoundBox(UI_ctx, 1510-howToPlayScreen.dragScreen_delta-(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))) * ((activate > 3) ? 1 : -1), 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(activate >= 3.5 && activate < 4.5){
        drawRoundBox(UI_ctx, 2060-howToPlayScreen.dragScreen_delta, 520, 1000-(1000 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)), 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }else{
        drawRoundBox(UI_ctx, 2060-howToPlayScreen.dragScreen_delta-(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))) * ((activate > 4) ? 1 : -1), 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(activate >= 4.5 && activate <= 5){
        drawRoundBox(UI_ctx, 2610-howToPlayScreen.dragScreen_delta, 520, 1000-(1000 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)), 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }else{
        drawRoundBox(UI_ctx, 2610-howToPlayScreen.dragScreen_delta+(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))), 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
};

howToPlayScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0, 0, 1920, 1080);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "How To Play", "center", "GmarketSansMedium");
};

howToPlayScreen.check = function (userMouse, userKeyboard, checkUIList) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height)) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
    if(userMouse.press === true) {
        if(checkTouch(userMouse.x, userMouse.y, 960, 520, 1920, 760)) {
            if(howToPlayScreen.dragScreen_start === false) {
                howToPlayScreen.dragScreen_delta_before = howToPlayScreen.dragScreen_delta;
                howToPlayScreen.dragScreen_start_x = userMouse.x;
                howToPlayScreen.dragScreen_start = true;
            }else{
                howToPlayScreen.dragScreen_delta = Math.min(Math.max(howToPlayScreen.dragScreen_delta_before - ((userMouse.x - howToPlayScreen.dragScreen_start_x) * (1+(Math.abs(userMouse.x - howToPlayScreen.dragScreen_start_x)/200))), -550), 1650);
            }
        }
    }else{
        howToPlayScreen.dragScreen_start = false;
    }
};

export {howToPlayScreen};