const needPasswordInputScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {checkTouch} from "./tools/checkTouch";
import {Color_list} from "../data/color_list";
import {textInputElement} from "./tools/textInputElement";
import {viewServerListScreen} from "./view-server-list-screen";
import {joiningRoomScreen} from "./joining-room-screen";
import {joinRoomWithIdScreen} from "./join-room-with-id-screen";

let blue_1 = `rgba(${Color_list.button_blue_1_rgb[0]}, ${Color_list.button_blue_1_rgb[1]}, ${Color_list.button_blue_1_rgb[2]}, 0.5)`;
let blue_2 = `rgba(${Color_list.button_blue_2_rgb[0]}, ${Color_list.button_blue_2_rgb[1]}, ${Color_list.button_blue_2_rgb[2]}, 0.5)`;
let blue_text = `rgba(${Color_list.text_default_rgb[0]}, ${Color_list.text_default_rgb[1]}, ${Color_list.text_default_rgb[2]}, 0.5)`;

needPasswordInputScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    needPasswordInputScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0,0,1920,1080);
    needPasswordInputScreen.checkUIList = [];
    needPasswordInputScreen.checkUIList.push({
        tag: "need-password-input-screen-submit",
        center_x: 480,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            if(Screen.currentScreen.checkUIList[0].clickable === -1){
                let alreadyExist = false;
                for(let i = 0; i<Screen.alert.data.length; i++){
                    if(Screen.alert.data[i].tag === 'yetfinishform'){
                        alreadyExist = true;
                        let alert_text = 'password must be 1~10 characters';
                        Screen.alert.data[i].text = alert_text;
                        Screen.alert.data[i].time = 150;
                    }else{
                        Screen.alert.data.push({
                            tag: 'yetfinishform',
                            text: 'password must be 1~10 characters',
                            time: 150,
                        });
                    }
                }
            }else{
                needPasswordInputScreen.password_input.hide(Screen.activatedHtmlElement);
                Screen.currentScreen = joiningRoomScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                Screen.socket.emit('join room', joinRoomWithIdScreen.nickname_input.get_value(), joinRoomWithIdScreen.room_id_input.get_value(), needPasswordInputScreen.password_input.get_value(), (callback) => {
                    if(callback.status === 200){
                        console.log(callback.roomInfo);
                        console.log(callback.playerInfos);
                    }else{
                        if(callback.message === 'wrong password'){
                            Screen.alert.data.push({
                                tag: 'wrong-password',
                                text: 'wrong password',
                                time: 150,
                            })
                        }
                        Screen.currentScreen = needPasswordInputScreen;
                        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                    }
                });
            }
        },
        clickable: -1,
    })
    needPasswordInputScreen.checkUIList.push({
        tag: "need-password-input-screen-cancel",
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            Screen.currentScreen = viewServerListScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0,
    })
    needPasswordInputScreen.password_input = new textInputElement('join_room_password_input', 1380, 520, 670, 80, 60, Color_list.button_red_1_hex, Color_list.button_gray_1_hex, function (value) {
        if (value.length > 0 && value.length < 11) {
            return true;
        } else {
            return false;
        }
    })
    needPasswordInputScreen.password_input.show(Screen.activatedHtmlElement);
    needPasswordInputScreen.password_input.resize(Screen.scale, window.innerWidth, window.innerHeight);
}

needPasswordInputScreen.draw = function (Background_ctx, UI_ctx, Screen) {
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

needPasswordInputScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0,0,1920,1080);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Entering Room", "center", "GmarketSansMedium");
    drawRoundBox(Background_ctx, 960, 520, 1600, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 50);
    drawText(Background_ctx, 200, 520, 80, 0, Color_list.text_default_hex, undefined, undefined, "Password > ", "left", "GmarketSansMedium");
}

needPasswordInputScreen.check = function (userMouse, userKeyboard, checkUIList) {
    if(userMouse.click === true){
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height) && checkUIList[i].clickable <= 0) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
    if(needPasswordInputScreen.password_input.check(needPasswordInputScreen.password_input.get_value())){
        checkUIList[0].clickable = 0;
    }else{
        checkUIList[0].clickable = -1;
    }
}

export {needPasswordInputScreen};