const viewServerListScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {Color_list} from "../data/color_list";
import {checkTouch} from "./tools/checkTouch";
import {titleScreen} from "./title-screen";
import {drawLine} from "./tools/drawLine";

let refresh_1 = `rgba(${Color_list.button_red_1_rgb[0]}, ${Color_list.button_red_1_rgb[1]}, ${Color_list.button_red_1_rgb[2]}, 0.5)`;
let refresh_2 = `rgba(${Color_list.button_red_2_rgb[0]}, ${Color_list.button_red_2_rgb[1]}, ${Color_list.button_red_2_rgb[2]}, 0.5)`;
let refresh_text = `rgba(${Color_list.text_default_rgb[0]}, ${Color_list.text_default_rgb[1]}, ${Color_list.text_default_rgb[2]}, 0.5)`;

viewServerListScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    viewServerListScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0,0,1920,1080);
    viewServerListScreen.checkUIList = [];
    viewServerListScreen.checkUIList.push({
        tag: "view-server-list-screen-back",
        center_x: 180,
        center_y: 72,
        width: 240,
        height: 96,
        clicked: function () {
            Screen.currentScreen = titleScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0
    });
    viewServerListScreen.checkUIList.push({
        tag: "view-server-list-screen-refresh",
        center_x: 1700,
        center_y: 72,
        width: 320,
        height: 96,
        clicked: function () {
            console.log("view-server-list-screen-refresh");
        },
        clickable: 300
    });
    viewServerListScreen.checkUIList.push({
        tag: "view-server-list-screen-make-new-room",
        center_x: 480,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            console.log("view-server-list-screen-make-new-room")
        },
        clickable: 0
    });
    viewServerListScreen.checkUIList.push({
        tag: "view-server-list-screen-join-room-id",
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            console.log("view-server-list-screen-join-room-id")
        },
        clickable: 0
    });
};

viewServerListScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0,0,1920,1080);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96)){
        drawRoundBox(UI_ctx, 180, 72, 240*1.05, 96*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 180, 72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 180, 72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180, 72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 480, 990, 720, 120)){
        drawRoundBox(UI_ctx, 480, 990, 720*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 480, 990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Make New Room", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 480, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
        drawText(UI_ctx, 480, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Make New Room", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120)){
        drawRoundBox(UI_ctx, 1440, 990, 720*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 1440, 990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Join Room with ID", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1440, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
        drawText(UI_ctx, 1440, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Join Room with ID", "center", "GmarketSansMedium");
    }
    if(viewServerListScreen.checkUIList[1].clickable > 0){
        drawRoundBox(UI_ctx, 1700, 72, 320, 96, refresh_1, refresh_2, 10, 25);
        drawText(UI_ctx, 1700, 72, 60, 0, refresh_text, undefined, undefined, "Refresh", "center", "GmarketSansMedium");
    }else{
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1700, 72, 320, 96)){
            drawRoundBox(UI_ctx, 1700, 72, 320*1.05, 96*1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 1700, 72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Refresh", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 1700, 72, 320, 96, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
            drawText(UI_ctx, 1700, 72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Refresh", "center", "GmarketSansMedium");
        }
    }
};

viewServerListScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0,0,1920,1080);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Room List", "center", "GmarketSansMedium");
    drawRoundBox(Background_ctx, 960, 520, 1600, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 50);
    drawLine(Background_ctx, 950, 875, 970, 825, Color_list.button_gray_3_hex, 10);
};

viewServerListScreen.check = function (userMouse, userKeyboard, checkUIList) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height) && checkUIList[i].clickable === 0) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
    for(let i = 0; i < checkUIList.length; i++){
        if(checkUIList[i].clickable > 0){
            checkUIList[i].clickable -= 1;
        }
    }
};

export {viewServerListScreen};