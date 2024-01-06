const needNicknameScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {checkTouch} from "./tools/checkTouch";
import {Color_list} from "../data/color_list";
import {textInputElement} from "./tools/textInputElement";
import {viewServerListScreen} from "./view-server-list-screen";
import {joiningRoomScreen} from "./joining-room-screen";
import {waitingRoomScreen} from "./waiting-room-screen";

let blue_1 = `rgba(${Color_list.button_blue_1_rgb[0]}, ${Color_list.button_blue_1_rgb[1]}, ${Color_list.button_blue_1_rgb[2]}, 0.5)`;
let blue_2 = `rgba(${Color_list.button_blue_2_rgb[0]}, ${Color_list.button_blue_2_rgb[1]}, ${Color_list.button_blue_2_rgb[2]}, 0.5)`;
let blue_text = `rgba(${Color_list.text_default_rgb[0]}, ${Color_list.text_default_rgb[1]}, ${Color_list.text_default_rgb[2]}, 0.5)`;

needNicknameScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    needNicknameScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0,0,1920,1080);
    needNicknameScreen.checkUIList = [];
    needNicknameScreen.checkUIList.push({
        tag: "need-nickname-screen-submit",
        center_x: 480,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            if(Screen.currentScreen.checkUIList[0].clickable === -1){
                Screen.alert.add_Data('yetfromfinish', 'nickname is too short or long', 5)
            }else{
                needNicknameScreen.nickname_input.hide(Screen.activatedHtmlElement);
                Screen.currentScreen = joiningRoomScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                Screen.socket.emit('join random room', needNicknameScreen.nickname_input.get_value(), (callback) => {
                    if(callback.status === 200){
                        Screen.gameroomInfo = callback.roomInfo;
                        if(!callback.playerInfos){
                            Screen.playerInfos = [{
                                number: 1,
                                name: needNicknameScreen.nickname_input.get_value(),
                                role: 'owner'
                            }];
                            Screen.Client_room_id = 1;
                        }else{
                            Screen.playerInfos = callback.playerInfos;
                            Screen.Client_room_id = callback.playerNumber;
                        }
                        Screen.currentScreen = waitingRoomScreen;
                        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                    }else{
                        Screen.alert.add_Data('somethingwrong', 'Something went wrong with your client', 5)
                        Screen.currentScreen = viewServerListScreen;
                        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                    }
                });
            }
        },
        clickable: -1,
    });
    needNicknameScreen.checkUIList.push({
        tag: "need-nickname-screen-cancel",
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            needNicknameScreen.nickname_input.hide(Screen.activatedHtmlElement);
            Screen.currentScreen = viewServerListScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0,
    });
    needNicknameScreen.nickname_input = new textInputElement('user_name_input', 1380, 520, 670, 80, 60, Color_list.button_red_1_hex, Color_list.button_gray_1_hex, function (value) {
        Background_ctx.font = "40px GmarketSansMedium";
        let text = Background_ctx.measureText(value);
        if(text.width > 330 || text.width < 10 || text.fontBoundingBoxAscent - text.fontBoundingBoxDescent > 50){
            return false;
        }else{
            return true;
        }
    })
    needNicknameScreen.nickname_input.show(Screen.activatedHtmlElement);
    needNicknameScreen.nickname_input.resize(Screen.scale, window.innerWidth, window.innerHeight);
}

needNicknameScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0,0,1920,1080);
    if(Screen.currentScreen.checkUIList[0].clickable === -1){
        drawRoundBox(UI_ctx, 480,990, 720, 120, blue_1, blue_2, 10, 25);
        drawText(UI_ctx, 480,990, 60, 0, blue_text, undefined, undefined, "Submit", "center", "GmarketSansMedium");
    }else{
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 480, 990, 720, 120)){
            drawRoundBox(UI_ctx, 480,990, 720*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 480,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Submit", "center", "GmarketSansMedium");
        }else {
            drawRoundBox(UI_ctx, 480, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
            drawText(UI_ctx, 480, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Submit", "center", "GmarketSansMedium");
        }
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120)){
        drawRoundBox(UI_ctx, 1440,990, 720*1.05, 120*1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 1440,990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Cancel", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1440,990, 720, 120, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
        drawText(UI_ctx, 1440,990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Cancel", "center", "GmarketSansMedium");
    }
}

needNicknameScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0,0,1920,1080);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Entering Room", "center", "GmarketSansMedium");
    drawRoundBox(Background_ctx, 960, 520, 1600, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 50);
    drawText(Background_ctx, 200, 520, 80, 0, Color_list.text_default_hex, undefined, undefined, "Nickname > ", "left", "GmarketSansMedium");
}

needNicknameScreen.check = function (userMouse, userKeyboard, checkUIList) {
    if(userMouse.click === true){
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height) && checkUIList[i].clickable <= 0) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
    if(needNicknameScreen.nickname_input.check(needNicknameScreen.nickname_input.get_value())){
        checkUIList[0].clickable = 0;
    }else{
        checkUIList[0].clickable = -1;
    }
}

export {needNicknameScreen};