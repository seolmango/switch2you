import {checkTouch} from "./tools/checkTouch";
const makeNewRoomScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {Color_list} from "../data/color_list";
import {viewServerListScreen} from "./view-server-list-screen";
import {textInputElement} from "./tools/textInputElement";
import {checkboxElement} from "./tools/checkboxElement";
import {joiningRoomScreen} from "./joining-room-screen";
import {waitingRoomScreen} from "./waiting-room-screen";

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
            makeNewRoomScreen.nickname_input.hide(Screen.activatedHtmlElement);
            makeNewRoomScreen.roomname_input.hide(Screen.activatedHtmlElement);
            makeNewRoomScreen.password_input.hide(Screen.activatedHtmlElement);
            makeNewRoomScreen.visibility_checkbox.hide(Screen.activatedHtmlElement);
            makeNewRoomScreen.password_checkbox.hide(Screen.activatedHtmlElement);
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
                        let alert_text = '';
                        if(!makeNewRoomScreen.nickname_input.check(makeNewRoomScreen.nickname_input.get_value())){
                            alert_text = 'nickname must be 1~15 characters';
                        }else if(!makeNewRoomScreen.roomname_input.check(makeNewRoomScreen.roomname_input.get_value())){
                            alert_text = 'room name must be 1~10 characters';
                        }else if(makeNewRoomScreen.password_checkbox.get_value() && !makeNewRoomScreen.password_input.check(makeNewRoomScreen.password_input.get_value())){
                            alert_text = 'password must be 1~10 characters';
                        }else{
                            alert_text = 'Something went wrong with your client';
                        }
                        Screen.alert.data[i].time = 150;
                        Screen.alert.data[i].text = alert_text;
                    }
                }
                if(!alreadyExist) {
                    let alert_text = '';
                    if(!makeNewRoomScreen.nickname_input.check(makeNewRoomScreen.nickname_input.get_value())){
                        alert_text = 'nickname must be 1~15 characters';
                    }else if(!makeNewRoomScreen.roomname_input.check(makeNewRoomScreen.roomname_input.get_value())){
                        alert_text = 'room name must be 1~20 characters';
                    }else if(makeNewRoomScreen.password_checkbox.get_value() && !makeNewRoomScreen.password_input.check(makeNewRoomScreen.password_input.get_value())){
                        alert_text = 'password must be 1~10 characters';
                    }else{
                        alert_text = 'Something went wrong with your client';
                    }
                    Screen.alert.data.push({
                        tag: 'yetfinishform',
                        text: alert_text,
                        time: 150
                    });
                }
            }else{
                makeNewRoomScreen.nickname_input.hide(Screen.activatedHtmlElement);
                makeNewRoomScreen.roomname_input.hide(Screen.activatedHtmlElement);
                makeNewRoomScreen.password_input.hide(Screen.activatedHtmlElement);
                makeNewRoomScreen.visibility_checkbox.hide(Screen.activatedHtmlElement);
                makeNewRoomScreen.password_checkbox.hide(Screen.activatedHtmlElement);
                Screen.currentScreen = joiningRoomScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                Screen.socket.emit('create room', makeNewRoomScreen.nickname_input.get_value(), makeNewRoomScreen.roomname_input.get_value(), makeNewRoomScreen.visibility_checkbox.get_value(), (makeNewRoomScreen.password_checkbox.get_value()) ? makeNewRoomScreen.password_input.get_value() : false, (callback) => {
                    if(callback.status === 200){
                        Screen.gameroomInfo = callback.roomInfo;
                        Screen.gameroomPlayerInfo = [{
                            number: 1,
                            name: makeNewRoomScreen.nickname_input.get_value(),
                            role: 'owner'
                        }]
                        Screen.Client_room_id = 1;
                        Screen.currentScreen = waitingRoomScreen;
                        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                    }else{
                        if(callback.message === 'server full'){
                            Screen.alert.add_Data('serverfull', 'Server is full', 5);
                        }else{
                            Screen.alert.add_Data('somethingwrong', 'Something went wrong with your client', 5);
                        }
                        Screen.currentScreen = viewServerListScreen;
                        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                    }
                });
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
            makeNewRoomScreen.nickname_input.hide(Screen.activatedHtmlElement);
            makeNewRoomScreen.roomname_input.hide(Screen.activatedHtmlElement);
            makeNewRoomScreen.password_input.hide(Screen.activatedHtmlElement);
            makeNewRoomScreen.visibility_checkbox.hide(Screen.activatedHtmlElement);
            makeNewRoomScreen.password_checkbox.hide(Screen.activatedHtmlElement);
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0
    })
    makeNewRoomScreen.nickname_input = new textInputElement('user_name_input', 1360, 292, 700, 80, 60, Color_list.button_red_1_hex, Color_list.button_gray_1_hex, function (value) {
        if(value.length > 0 && value.length < 16){
            return true;
        }else{
            return false;
        }
    });
    makeNewRoomScreen.nickname_input.show(Screen.activatedHtmlElement);
    makeNewRoomScreen.nickname_input.resize(Screen.scale, window.innerWidth, window.innerHeight);
    makeNewRoomScreen.roomname_input = new textInputElement('room_name_input', 1360, 444, 700, 80, 60, Color_list.button_red_1_hex, Color_list.button_gray_1_hex, function (value) {
        if(value.length > 0 && value.length < 11){
            return true;
        }else{
            return false;
        }
    });
    makeNewRoomScreen.roomname_input.show(Screen.activatedHtmlElement);
    makeNewRoomScreen.roomname_input.resize(Screen.scale, window.innerWidth, window.innerHeight);
    makeNewRoomScreen.password_input = new textInputElement('make_room_password_input', 1380, 748, 670, 80, 60, Color_list.button_red_1_hex, Color_list.button_gray_1_hex, function (value) {
        if(makeNewRoomScreen.password_checkbox.get_value()){
            if(value.length > 0 && value.length < 11){
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    });
    makeNewRoomScreen.password_input.show(Screen.activatedHtmlElement);
    makeNewRoomScreen.password_input.resize(Screen.scale, window.innerWidth, window.innerHeight);
    makeNewRoomScreen.password_input.lock();
    makeNewRoomScreen.visibility_checkbox = new checkboxElement('make_room_visibility_checkbox', 775, 580, 80, 80, Color_list.button_gray_1_hex, function () {});
    makeNewRoomScreen.visibility_checkbox.show(Screen.activatedHtmlElement);
    makeNewRoomScreen.visibility_checkbox.resize(Screen.scale, window.innerWidth, window.innerHeight);
    makeNewRoomScreen.password_checkbox = new checkboxElement('make_room_password_checkbox', 1500, 580, 80, 80, Color_list.button_gray_1_hex, function () {
        if(makeNewRoomScreen.password_checkbox.get_value()){
            makeNewRoomScreen.password_input.unlock();
        }else{
            makeNewRoomScreen.password_input.lock();
            makeNewRoomScreen.password_input.set_value("");
        }
    });
    makeNewRoomScreen.password_checkbox.show(Screen.activatedHtmlElement);
    makeNewRoomScreen.password_checkbox.resize(Screen.scale, window.innerWidth, window.innerHeight);
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
    drawText(Background_ctx, 200, 292, 80, 0, Color_list.text_default_hex, undefined, undefined, "Your Nickname >", "left", "GmarketSansMedium");
    drawText(Background_ctx, 200, 444, 80, 0, Color_list.text_default_hex, undefined, undefined, "Room Name >", "left", "GmarketSansMedium");
    drawText(Background_ctx, 200, 596, 80, 0, Color_list.text_default_hex, undefined, undefined, "Visibility >", "left", "GmarketSansMedium");
    drawText(Background_ctx, 1000, 596, 80, 0, Color_list.text_default_hex, undefined, undefined, "Lock > ", "left", "GmarketSansMedium");
    drawText(Background_ctx, 200, 748, 80, 0, Color_list.text_default_hex, undefined, undefined, "Room Password >", "left", "GmarketSansMedium");
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
    if(makeNewRoomScreen.nickname_input.check(makeNewRoomScreen.nickname_input.get_value()) && makeNewRoomScreen.roomname_input.check(makeNewRoomScreen.roomname_input.get_value()) && makeNewRoomScreen.password_input.check(makeNewRoomScreen.password_input.get_value())) {
        checkUIList[1].clickable = 0;
    }else{
        checkUIList[1].clickable = -1;
    }
}

export {makeNewRoomScreen};