const howToPlayScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {checkTouch} from "./tools/checkTouch";
import {drawCircle} from "./tools/drawCircle";
import {drawLine} from "./tools/drawLine";
import {Color_list} from "../data/color_list"

import {titleScreen} from "./title-screen";

let red_1 = `rgba(${Color_list.button_red_1_rgb[0]}, ${Color_list.button_red_1_rgb[1]}, ${Color_list.button_red_1_rgb[2]}, 0.5)`;
let red_2 = `rgba(${Color_list.button_red_2_rgb[0]}, ${Color_list.button_red_2_rgb[1]}, ${Color_list.button_red_2_rgb[2]}, 0.5)`;
let red_text = `rgba(${Color_list.text_default_rgb[0]}, ${Color_list.text_default_rgb[1]}, ${Color_list.text_default_rgb[2]}, 0.5)`;

function getActivate(delta = howToPlayScreen.dragScreen_delta) {
    let activate = 0;
    if(delta >= -550 && delta <= -350){
        activate = 1
    }else if(delta > -350 && delta < -200){
        activate = 1 + (delta + 350) / 150
    }else if(delta >= -200 && delta <= 200){
        activate = 2
    }else if(delta > 200 && delta < 350){
        activate = 2 + (delta - 200) / 150
    }else if(delta >= 350 && delta <= 750){
        activate = 3
    }else if(delta > 750 && delta < 900){
        activate = 3 + (delta - 750) / 150
    }else if(delta >= 900 && delta <= 1300){
        activate = 4
    }else if(delta > 1300 && delta < 1450){
        activate = 4 + (delta - 1300) / 150
    }else if(delta >= 1450 && delta <= 1650){
        activate = 5
    }
    return activate;
}

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
    howToPlayScreen.checkUIList.push({
        tag: 'how-to-play-screen-pre-page',
        center_x: 650,
        center_y: 990,
        width: 96,
        height: 96,
        clicked: function () {
            let activate = getActivate((howToPlayScreen.dragScreen_delta_queue_going === null) ? howToPlayScreen.dragScreen_delta : howToPlayScreen.dragScreen_delta_queue_going);
            activate = Math.max(1, Math.floor(activate-1));
            let need_delta = (-550 + (550 * (activate-1))) - ((howToPlayScreen.dragScreen_delta_queue_going === null) ? howToPlayScreen.dragScreen_delta : howToPlayScreen.dragScreen_delta_queue_going);
            for(let i=0; i<20; i++){
                howToPlayScreen.dragScreen_delta_queue.push(need_delta/20);
            }
            howToPlayScreen.dragScreen_delta_queue_going = (-550 + (550 * (activate-1)));
        }
    });
    howToPlayScreen.checkUIList.push({
        tag: 'how-to-play-screen-next-page',
        center_x: 1270,
        center_y: 990,
        width: 96,
        height: 96,
        clicked: function () {
            let activate = getActivate((howToPlayScreen.dragScreen_delta_queue_going === null) ? howToPlayScreen.dragScreen_delta : howToPlayScreen.dragScreen_delta_queue_going);
            activate = Math.min(5, Math.ceil(activate+1));
            let need_delta = (-550 + (550 * (activate-1))) - ((howToPlayScreen.dragScreen_delta_queue_going === null) ? howToPlayScreen.dragScreen_delta : howToPlayScreen.dragScreen_delta_queue_going);
            for(let i=0; i<20; i++){
                howToPlayScreen.dragScreen_delta_queue.push(need_delta/20);
            }
            howToPlayScreen.dragScreen_delta_queue_going = (-550 + (550 * (activate-1)));
        }
    });
    howToPlayScreen.dragScreen_delta = -550;
    howToPlayScreen.dragScreen_delta_before = -550;
    howToPlayScreen.dragScreen_start_x = 0;
    howToPlayScreen.dragScreen_start = false;
    howToPlayScreen.dragScreen_delta_queue = [];
    howToPlayScreen.dragScreen_delta_queue_going = null;
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
    let activate = getActivate();
    if(activate === 1){
        drawRoundBox(UI_ctx, 650,990, 96, 96, red_1, red_2, 10, 25);
        drawText(UI_ctx, 650,990, 60, 0, red_text, undefined, undefined, "<", "center", "GmarketSansMedium");
    }else{
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 650, 990, 96, 96)){
            drawRoundBox(UI_ctx, 650,990, 96*1.05, 96*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 650,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "<", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 650,990, 96, 96, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
            drawText(UI_ctx, 650,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "<", "center", "GmarketSansMedium");
        }
    }
    if(activate === 5){
        drawRoundBox(UI_ctx, 1270,990, 96, 96, red_1, red_2, 10, 25);
        drawText(UI_ctx, 1270,990, 60, 0, red_text, undefined, undefined, ">", "center", "GmarketSansMedium");
    }else{
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1270, 990, 96, 96)) {
            drawRoundBox(UI_ctx, 1270, 990, 96 * 1.05, 96 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
            drawText(UI_ctx, 1270, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, ">", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 1270, 990, 96, 96, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
            drawText(UI_ctx, 1270, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, ">", "center", "GmarketSansMedium");
        }
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
    if(activate === 1){
        drawText(UI_ctx, 410-howToPlayScreen.dragScreen_delta, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "1. Basic Rule", "center", "GmarketSansMedium");
        drawText(UI_ctx, 410-howToPlayScreen.dragScreen_delta - 410, 280, 50, 0, Color_list.text_onmouse_hex, undefined, undefined, "One of the players in 'swITch'\nbecomes a tagger. The other \nplayers become runners. The\ntagger can be distinguished\nby looking at the border.", "left", "GmarketSansMedium");
        drawCircle(UI_ctx, 410-howToPlayScreen.dragScreen_delta - 150, 750, 50, Color_list.player_1_inside_hex, Color_list.player_1_outside_hex, 20);
        drawText(UI_ctx, 410-howToPlayScreen.dragScreen_delta - 150, 850, 50, 0, Color_list.text_onmouse_hex, undefined, undefined, "Runner", "center", "GmarketSansMedium");
        drawCircle(UI_ctx, 410-howToPlayScreen.dragScreen_delta + 150, 750, 50, Color_list.player_5_inside_hex, Color_list.player_tagger_outside_hex, 20);
        drawText(UI_ctx, 410-howToPlayScreen.dragScreen_delta + 150, 850, 50, 0, Color_list.text_onmouse_hex, undefined, undefined, "Tagger", "center", "GmarketSansMedium");
    }else{
        drawText(UI_ctx, 520, -(410-howToPlayScreen.dragScreen_delta-(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)))),80, 90, Color_list.text_default_hex, undefined, undefined, "1. Basic Rule", "center", "GmarketSansMedium");
    }
    if(activate >= 1.5 && activate < 2.5){
        drawRoundBox(UI_ctx, 960-howToPlayScreen.dragScreen_delta, 520, 1000-(1000 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)), 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }else{
        drawRoundBox(UI_ctx, 960-howToPlayScreen.dragScreen_delta-(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))) * ((activate > 2) ? 1 : -1), 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(activate === 2){
        drawText(UI_ctx, 960-howToPlayScreen.dragScreen_delta, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "2. Goal", "center", "GmarketSansMedium");
        drawText(UI_ctx, 960-howToPlayScreen.dragScreen_delta - 410, 280, 50, 0, Color_list.text_onmouse_hex, undefined, undefined, "When the tagger tags runner,\nthe runner is out. The game\ncontinues until the tagger and\none runner, again, two\nplayers are left.", "left", "GmarketSansMedium");
    }else{
        drawText(UI_ctx, 520, -(960-howToPlayScreen.dragScreen_delta-((250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)))*((activate > 2) ? 1 : -1))),80, 90, Color_list.text_default_hex, undefined, undefined, "2. Goal", "center", "GmarketSansMedium");
    }
    if(activate >= 2.5 && activate < 3.5){
        drawRoundBox(UI_ctx, 1510-howToPlayScreen.dragScreen_delta, 520, 1000-(1000 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)), 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }else{
        drawRoundBox(UI_ctx, 1510-howToPlayScreen.dragScreen_delta-(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))) * ((activate > 3) ? 1 : -1), 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(activate === 3){
        drawText(UI_ctx, 1510-howToPlayScreen.dragScreen_delta, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "3. Skill-switch", "center", "GmarketSansMedium");
        drawText(UI_ctx, 1510-howToPlayScreen.dragScreen_delta - 420, 280, 50, 0, Color_list.text_onmouse_hex, undefined, undefined, "On the verge of being tagged?\nWhen your distance from\nthe tagger is close enough, tap\nanother player's number to\nchange the tagger.", "left", "GmarketSansMedium");
    }else{
        drawText(UI_ctx, 520, -(1510-howToPlayScreen.dragScreen_delta-((250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)))*((activate > 3) ? 1 : -1))),80, 90, Color_list.text_default_hex, undefined, undefined, "3. Skill-switch", "center", "GmarketSansMedium");
    }
    if(activate >= 3.5 && activate < 4.5){
        drawRoundBox(UI_ctx, 2060-howToPlayScreen.dragScreen_delta, 520, 1000-(1000 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)), 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }else{
        drawRoundBox(UI_ctx, 2060-howToPlayScreen.dragScreen_delta-(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))) * ((activate > 4) ? 1 : -1), 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(activate === 4){
        drawText(UI_ctx, 2060-howToPlayScreen.dragScreen_delta, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "4. Skill-dash", "center", "GmarketSansMedium");
        drawText(UI_ctx, 2060-howToPlayScreen.dragScreen_delta - 420, 280, 50, 0, Color_list.text_onmouse_hex, undefined, undefined, "Is it moving too slowly? Then\npress the space bar and\nrush quickly! All other players\ncan see footsteps that\nyou made a long time ago!", "left", "GmarketSansMedium")
    }else{
        drawText(UI_ctx, 520, -(2060-howToPlayScreen.dragScreen_delta-((250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)))*((activate > 4) ? 1 : -1))),80, 90, Color_list.text_default_hex, undefined, undefined, "4. Skill-dash", "center", "GmarketSansMedium");
    }
    if(activate >= 4.5 && activate <= 5){
        drawRoundBox(UI_ctx, 2610-howToPlayScreen.dragScreen_delta, 520, 1000-(1000 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1)), 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }else{
        drawRoundBox(UI_ctx, 2610-howToPlayScreen.dragScreen_delta+(250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))), 520, 500, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
    }
    if(activate === 5){
        drawText(UI_ctx, 2610-howToPlayScreen.dragScreen_delta, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "5. Skill-teleport", "center", "GmarketSansMedium");
        drawText(UI_ctx, 2610-howToPlayScreen.dragScreen_delta - 410, 280, 50, 0, Color_list.text_onmouse_hex, undefined, undefined, "Is dash skill too slow? Then\ntry changing the dash skill\nto teleport. The distance is\nshort than dash, but it\ncan go over the wall.", "left", "GmarketSansMedium");
    }else{
        drawText(UI_ctx, 520, -(2610-howToPlayScreen.dragScreen_delta+((250-(500 * ((activate % 1 >= 0.5) ? 1-(activate % 1) : activate % 1))))),80, 90, Color_list.text_default_hex, undefined, undefined, "5. Skill-teleport", "center", "GmarketSansMedium");
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
                howToPlayScreen.dragScreen_delta = Math.min(Math.max(howToPlayScreen.dragScreen_delta_before - ((userMouse.x - howToPlayScreen.dragScreen_start_x) * (0.2+(Math.abs(userMouse.x - howToPlayScreen.dragScreen_start_x)/500))), -550), 1650);
            }
        }
    }else{
        howToPlayScreen.dragScreen_start = false;
    }
    if(howToPlayScreen.dragScreen_delta_queue.length > 0){
        howToPlayScreen.dragScreen_delta += howToPlayScreen.dragScreen_delta_queue[0];
        howToPlayScreen.dragScreen_delta = Math.min(Math.max(howToPlayScreen.dragScreen_delta, -550), 1650);
        howToPlayScreen.dragScreen_delta_queue.splice(0, 1);
    }else{
        howToPlayScreen.dragScreen_delta_queue_going = null;
    }
};

export {howToPlayScreen};