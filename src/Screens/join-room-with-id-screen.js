const joinRoomWithIdScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {Color_list} from "../data/color_list";
import {viewServerListScreen} from "./view-server-list-screen";
import {checkTouch} from "./tools/checkTouch";
import {textInputElement} from "./tools/textInputElement";
import {joiningRoomScreen} from "./joining-room-screen";
import {needPasswordInputScreen} from "./need-password-input-screen";
import {waitingRoomScreen} from "./waiting-room-screen";
import {clearCtx} from "./tools/clearCtx";

let join_1 = `rgba(${Color_list.button_blue_1_rgb[0]}, ${Color_list.button_blue_1_rgb[1]}, ${Color_list.button_blue_1_rgb[2]}, 0.5)`;
let join_2 = `rgba(${Color_list.button_blue_2_rgb[0]}, ${Color_list.button_blue_2_rgb[1]}, ${Color_list.button_blue_2_rgb[2]}, 0.5)`;
let join_text = `rgba(${Color_list.text_default_rgb[0]}, ${Color_list.text_default_rgb[1]}, ${Color_list.text_default_rgb[2]}, 0.5)`;

joinRoomWithIdScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    joinRoomWithIdScreen.redrawBackground(Background_ctx);
    clearCtx(UI_ctx);
    joinRoomWithIdScreen.checkUIList = [];
    joinRoomWithIdScreen.checkUIList.push({
        tag: "join-room-with-id-screen-back",
        center_x: 180,
        center_y: 72,
        width: 240,
        height: 96,
        clicked: function () {
            Screen.currentScreen = viewServerListScreen;
            joinRoomWithIdScreen.nickname_input.hide(Screen.activatedHtmlElement);
            joinRoomWithIdScreen.room_id_input.hide(Screen.activatedHtmlElement);
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0
    })
    joinRoomWithIdScreen.checkUIList.push({
        tag: "join-room-with-id-screen-join",
        center_x: 480,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            if(Screen.currentScreen.checkUIList[1].clickable === -1){
                let alert_text = '';
                if(!joinRoomWithIdScreen.nickname_input.check(joinRoomWithIdScreen.nickname_input.get_value())){
                    alert_text = 'nickname is too short or too long';
                }else if(!joinRoomWithIdScreen.room_id_input.check(joinRoomWithIdScreen.room_id_input.get_value())){
                    alert_text = 'room id must be 8 characters';
                }else{
                    alert_text = 'Something went wrong with your client';
                }
                Screen.alert.add_Data('yetfromfinish', alert_text, 5)
            }else{
                joinRoomWithIdScreen.nickname_input.hide(Screen.activatedHtmlElement);
                joinRoomWithIdScreen.room_id_input.hide(Screen.activatedHtmlElement);
                Screen.currentScreen = joiningRoomScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                Screen.socket.emit('join room', joinRoomWithIdScreen.nickname_input.get_value(), joinRoomWithIdScreen.room_id_input.get_value(), false, (callback) => {
                    if(callback.status === 200){
                        Screen.gameroomInfo = callback.roomInfo;
                        Screen.playerInfos = callback.playerInfos;
                        Screen.Client_room_id = callback.playerNumber;
                        Screen.currentScreen = waitingRoomScreen;
                        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                    }else{
                        if(callback.message === 'must have password') {
                            Screen.currentScreen = needPasswordInputScreen;
                            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                        }else{
                            Screen.alert.add_Data('notexistroom', 'Room not exist', 5);
                            Screen.currentScreen = joinRoomWithIdScreen;
                            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                        }
                    }
                });
            }
        },
        clickable: -1
    })
    joinRoomWithIdScreen.checkUIList.push({
        tag: "join-room-with-id-screen-cancel",
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            Screen.currentScreen = viewServerListScreen;
            joinRoomWithIdScreen.nickname_input.hide(Screen.activatedHtmlElement);
            joinRoomWithIdScreen.room_id_input.hide(Screen.activatedHtmlElement);
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0
    })
    joinRoomWithIdScreen.nickname_input = new textInputElement('user_name_input', 1360, 393, 700, 80, 60, Color_list.button_red_1_hex, Color_list.button_gray_1_hex, function (value) {
        Background_ctx.font = "40px GmarketSansMedium";
        let text = Background_ctx.measureText(value);
        if(text.width > 330 || text.width < 10 || text.fontBoundingBoxAscent - text.fontBoundingBoxDescent > 50){
            return false;
        }else{
            return true;
        }
    });
    joinRoomWithIdScreen.nickname_input.show(Screen.activatedHtmlElement);
    joinRoomWithIdScreen.nickname_input.resize(Screen.scale, window.innerWidth, window.innerHeight, UI_ctx.displayDPI);
    joinRoomWithIdScreen.room_id_input = new textInputElement('join_room_id_input', 1360, 646, 700, 80, 60, Color_list.button_red_1_hex, Color_list.button_gray_1_hex, function (value) {
        if(value.length === 8){
            return true;
        }else{
            return false;
        }
    });
    joinRoomWithIdScreen.room_id_input.show(Screen.activatedHtmlElement);
    joinRoomWithIdScreen.room_id_input.resize(Screen.scale, window.innerWidth, window.innerHeight, UI_ctx.displayDPI);
    joinRoomWithIdScreen.room_id_input.set_value('');
}

joinRoomWithIdScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    clearCtx(UI_ctx);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 180,72, 240*1.05, 96*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 180,72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 180,72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180,72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }
    if(Screen.currentScreen.checkUIList[1].clickable === -1){
        drawRoundBox(UI_ctx, 480,990, 720, 120, join_1, join_2, 10, 25);
        drawText(UI_ctx, 480,990, 60, 0, join_text, undefined, undefined, "Join", "center", "GmarketSansMedium");
    }else{
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 480, 990, 720, 120, UI_ctx.displayDPI)){
            drawRoundBox(UI_ctx, 480,990, 720*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 480,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Join", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 480,990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
            drawText(UI_ctx, 480,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Join", "center", "GmarketSansMedium");
        }
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 1440,990, 720*1.05, 120*1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 1440,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Cancel", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1440,990, 720, 120, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
        drawText(UI_ctx, 1440,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Cancel", "center", "GmarketSansMedium");
    }
}

joinRoomWithIdScreen.redrawBackground = function (Background_ctx) {
    clearCtx(Background_ctx);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Join Room with ID", "center", "GmarketSansMedium");
    drawRoundBox(Background_ctx, 960, 520, 1600, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 50);
    drawText(Background_ctx, 200, 393, 80, 0, Color_list.text_default_hex, undefined, undefined, "Your Nickname >", "left", "GmarketSansMedium");
    drawText(Background_ctx, 200, 646, 80, 0, Color_list.text_default_hex, undefined, undefined, "Room ID >", "left", "GmarketSansMedium");
}

joinRoomWithIdScreen.check = function (userMouse, userKeyboard, checkUIList, DPI) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height, DPI) && checkUIList[i].clickable <= 0) {
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
    if(joinRoomWithIdScreen.nickname_input.check(joinRoomWithIdScreen.nickname_input.get_value()) && joinRoomWithIdScreen.room_id_input.check(joinRoomWithIdScreen.room_id_input.get_value())) {
        checkUIList[1].clickable = 0;
    }else{
        checkUIList[1].clickable = -1;
    }
}

export {joinRoomWithIdScreen};