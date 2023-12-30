import {checkTouch} from "./tools/checkTouch";

const makeNewRoomScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {Color_list} from "../data/color_list";
import {viewServerListScreen} from "./view-server-list-screen";

let make_1 = `rgba(${Color_list.button_blue_1_rgb[0]}, ${Color_list.button_blue_1_rgb[1]}, ${Color_list.button_blue_1_rgb[2]}, 0.5)`;
let make_2 = `rgba(${Color_list.button_blue_2_rgb[0]}, ${Color_list.button_blue_2_rgb[1]}, ${Color_list.button_blue_2_rgb[2]}, 0.5)`;
let make_text = `rgba(${Color_list.text_default_rgb[0]}, ${Color_list.text_default_rgb[1]}, ${Color_list.text_default_rgb[2]}, 0.5)`;

makeNewRoomScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    makeNewRoomScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0,0,1920,1080);
    makeNewRoomScreen.checkUIList = [];
    makeNewRoomScreen.checkUIList.push({
        tag: "make-new-room-screen-back",
        center_x: 180,
        center_y: 72,
        width: 240,
        height: 96,
        clicked: function () {
            Screen.currentScreen = viewServerListScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0
    })
    makeNewRoomScreen.checkUIList.push({
        tag: "make-new-room-screen-make",
        center_x: 480,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            if(Screen.currentScreen.checkUIList[1].clickable === -1){
                let alreadyExist = false;
                for(let i=0; i<Screen.alert.data.length; i++){
                    if(Screen.alert.data[i].tag === 'yetfinishform') {
                        alreadyExist = true;
                        Screen.alert.data[i].time = 150;
                    }
                }
                if(!alreadyExist) {
                    Screen.alert.data.push({
                        tag: 'yetfinishform',
                        text: 'Please finish the form.',
                        time: 150
                    });
                }
            }
        },
        clickable: -1
    })
    makeNewRoomScreen.checkUIList.push({
        tag:"make-new-room-screen-cancel",
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            Screen.currentScreen = viewServerListScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0
    })
};

makeNewRoomScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0,0,1920,1080);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96)){
        drawRoundBox(UI_ctx, 180,72, 240*1.05, 96*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 180,72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 180,72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180,72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }
    if(Screen.currentScreen.checkUIList[1].clickable === -1){
        drawRoundBox(UI_ctx, 480,990, 720, 120, make_1, make_2, 10, 25);
        drawText(UI_ctx, 480,990, 60, 0, make_text, undefined, undefined, "Make", "center", "GmarketSansMedium");
    }else{
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 480, 990, 720, 120)){
            drawRoundBox(UI_ctx, 480,990, 720*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 480,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Make", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 480,990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
            drawText(UI_ctx, 480,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Make", "center", "GmarketSansMedium");
        }
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120)){
        drawRoundBox(UI_ctx, 1440,990, 720*1.05, 120*1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 1440,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Cancel", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1440,990, 720, 120, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
        drawText(UI_ctx, 1440,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Cancel", "center", "GmarketSansMedium");
    }
};

makeNewRoomScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0,0,1920,1080);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Make New Room", "center", "GmarketSansMedium");
    drawRoundBox(Background_ctx, 960, 520, 1600, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 50);
};

makeNewRoomScreen.check = function (userMouse, userKeyboard, checkUIList) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height) && checkUIList[i].clickable <= 0) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
    for(let i=0; i<checkUIList.length; i++){
        if(checkUIList[i].clickable > 0){
            checkUIList[i].clickable--;
        }
    }
}

export {makeNewRoomScreen};