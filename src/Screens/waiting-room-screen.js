const waitingRoomScreen = {};
import {Color_list} from "../data/color_list";
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {checkTouch} from "./tools/checkTouch";
import {viewServerListScreen} from "./view-server-list-screen";
import {drawCircle} from "./tools/drawCircle";
import {drawLine} from "./tools/drawLine";

waitingRoomScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    console.log(Screen.playerInfos, Screen.gameroomInfo);
    waitingRoomScreen.gameroomInfo = Screen.gameroomInfo;
    waitingRoomScreen.playerInfos = Screen.playerInfos;
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
            Screen.socket.emit('leave room', (callback) => {
                if (callback.status === 200){
                    Screen.currentScreen = viewServerListScreen;
                    Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                }else{
                    Screen.alert.add_Data('server error', 'Something went wrong', 5)
                }
            })
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-copy-id',
        center_x: 1740,
        center_y: 72,
        width: 300,
        height: 96,
        clicked: function () {
            let copytext = document.createElement('textarea');
            copytext.value = Screen.gameroomInfo.id;
            document.body.appendChild(copytext);
            copytext.select();
            document.execCommand('copy');
            document.body.removeChild(copytext);
            Screen.alert.add_Data('copied', 'Copied room ID to clipboard', 5);
        }
    });
    waitingRoomScreen.active_slot = 0;
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-1',
        center_x: 360,
        center_y: 330,
        width: 350,
        height: 350,
        clicked: function () {
            waitingRoomScreen.active_slot = 1;
            waitingRoomScreen.touch_any_slot = true;
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-2',
        center_x: 760,
        center_y: 330,
        width: 350,
        height: 350,
        clicked: function () {
            waitingRoomScreen.active_slot = 2;
            waitingRoomScreen.touch_any_slot = true;
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-3',
        center_x: 1160,
        center_y: 330,
        width: 350,
        height: 350,
        clicked: function () {
            waitingRoomScreen.active_slot = 3;
            waitingRoomScreen.touch_any_slot = true;
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-4',
        center_x: 1560,
        center_y: 330,
        width: 350,
        height: 350,
        clicked: function () {
            waitingRoomScreen.active_slot = 4;
            waitingRoomScreen.touch_any_slot = true;
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-5',
        center_x: 360,
        center_y: 710,
        width: 350,
        height: 350,
        clicked: function () {
            waitingRoomScreen.active_slot = 5;
            waitingRoomScreen.touch_any_slot = true;
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-6',
        center_x: 760,
        center_y: 710,
        width: 350,
        height: 350,
        clicked: function () {
            waitingRoomScreen.active_slot = 6;
            waitingRoomScreen.touch_any_slot = true;
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-7',
        center_x: 1160,
        center_y: 710,
        width: 350,
        height: 350,
        clicked: function () {
            waitingRoomScreen.active_slot = 7;
            waitingRoomScreen.touch_any_slot = true;
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-8',
        center_x: 1560,
        center_y: 710,
        width: 350,
        height: 350,
        clicked: function () {
            waitingRoomScreen.active_slot = 8;
            waitingRoomScreen.touch_any_slot = true;
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
    if (checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1740, 72, 300, 96)) {
        drawRoundBox(UI_ctx, 1740, 72, 300 * 1.05, 96 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 1740, 72, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Copy ID", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1740, 72, 300, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1740, 72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Copy ID", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 360, 330, 350, 350) || waitingRoomScreen.active_slot === 1){
        drawRoundBox(UI_ctx, 360, 330, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 360, 330, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Slot 1", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 360, 330, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 360, 330, 60, 0, Color_list.text_default_hex, undefined, undefined, "Slot 1", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 760, 330, 350, 350) || waitingRoomScreen.active_slot === 2) {
        drawRoundBox(UI_ctx, 760, 330, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 760, 330, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Slot 2", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 760, 330, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 760, 330, 60, 0, Color_list.text_default_hex, undefined, undefined, "Slot 2", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1160, 330, 350, 350) || waitingRoomScreen.active_slot === 3) {
        drawRoundBox(UI_ctx, 1160, 330, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 1160, 330, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Slot 3", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1160, 330, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1160, 330, 60, 0, Color_list.text_default_hex, undefined, undefined, "Slot 3", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1560, 330, 350, 350) || waitingRoomScreen.active_slot === 4) {
        drawRoundBox(UI_ctx, 1560, 330, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 1560, 330, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Slot 4", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1560, 330, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1560, 330, 60, 0, Color_list.text_default_hex, undefined, undefined, "Slot 4", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 360, 710, 350, 350) || waitingRoomScreen.active_slot === 5) {
        drawRoundBox(UI_ctx, 360, 710, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 360, 710, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Slot 5", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 360, 710, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 360, 710, 60, 0, Color_list.text_default_hex, undefined, undefined, "Slot 5", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 760, 710, 350, 350) || waitingRoomScreen.active_slot === 6) {
        drawRoundBox(UI_ctx, 760, 710, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 760, 710, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Slot 6", "center", "GmarketSansMedium");
    }else {
        drawRoundBox(UI_ctx, 760, 710, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 760, 710, 60, 0, Color_list.text_default_hex, undefined, undefined, "Slot 6", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1160, 710, 350, 350) || waitingRoomScreen.active_slot === 7) {
        drawRoundBox(UI_ctx, 1160, 710, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 1160, 710, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Slot 7", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1160, 710, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1160, 710, 60, 0, Color_list.text_default_hex, undefined, undefined, "Slot 7", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1560, 710, 350, 350) || waitingRoomScreen.active_slot === 8) {
        drawRoundBox(UI_ctx, 1560, 710, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 1560, 710, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Slot 8", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1560, 710, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1560, 710, 60, 0, Color_list.text_default_hex, undefined, undefined, "Slot 8", "center", "GmarketSansMedium");
    }
}

waitingRoomScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0, 0, 1920, 1080);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, `${waitingRoomScreen.gameroomInfo.name}`, "center", "GmarketSansMedium");
}

waitingRoomScreen.check = function (userMouse, userKeyboard, checkUIList){
    waitingRoomScreen.touch_any_slot = true;
    if(userMouse.click === true) {
        waitingRoomScreen.touch_any_slot = false;
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height)) {
                checkUIList[i].clicked();
                break;
            }
        }
        userMouse.click = false;
    }
    if(!waitingRoomScreen.touch_any_slot){
        waitingRoomScreen.active_slot = 0;
    }
}

export {waitingRoomScreen};