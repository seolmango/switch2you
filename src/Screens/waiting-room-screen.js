const waitingRoomScreen = {};
import {Color_list} from "../data/color_list";
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {checkTouch} from "./tools/checkTouch";
import {viewServerListScreen} from "./view-server-list-screen";
import {drawCircle} from "./tools/drawCircle";
import {drawLine} from "./tools/drawLine";

waitingRoomScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    Screen.join_room = true;
    waitingRoomScreen.gameroomInfo = Screen.gameroomInfo;
    waitingRoomScreen.playerInfos = Screen.playerInfos;
    waitingRoomScreen.Client_room_id = Screen.Client_room_id;
    waitingRoomScreen.user_slot = [false, false, false, false, false, false, false, false, false];
    for(let i = 0; i < waitingRoomScreen.playerInfos.length; i++){
        waitingRoomScreen.user_slot[waitingRoomScreen.playerInfos[i].number] = true;
        if(waitingRoomScreen.playerInfos[i].number === Screen.Client_room_id){
            waitingRoomScreen.Client_owner = (waitingRoomScreen.playerInfos[i].role === 'owner') ? true : false;
        }
    }
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
                    Screen.join_room = false;
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
            if((waitingRoomScreen.user_slot[1] === false || waitingRoomScreen.Client_owner) && waitingRoomScreen.Client_room_id !== 1) {
                waitingRoomScreen.active_slot = 1;
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-2',
        center_x: 760,
        center_y: 330,
        width: 350,
        height: 350,
        clicked: function () {
            if((waitingRoomScreen.user_slot[2] === false || waitingRoomScreen.Client_owner) && waitingRoomScreen.Client_room_id !== 2) {
                waitingRoomScreen.active_slot = 2;
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-3',
        center_x: 1160,
        center_y: 330,
        width: 350,
        height: 350,
        clicked: function () {
            if((waitingRoomScreen.user_slot[3] === false || waitingRoomScreen.Client_owner) && waitingRoomScreen.Client_room_id !== 3) {
                waitingRoomScreen.active_slot = 3;
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-4',
        center_x: 1560,
        center_y: 330,
        width: 350,
        height: 350,
        clicked: function () {
            if((waitingRoomScreen.user_slot[4] === false || waitingRoomScreen.Client_owner) && waitingRoomScreen.Client_room_id !== 4) {
                waitingRoomScreen.active_slot = 4;
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-5',
        center_x: 360,
        center_y: 710,
        width: 350,
        height: 350,
        clicked: function () {
            if((waitingRoomScreen.user_slot[5] === false || waitingRoomScreen.Client_owner) && waitingRoomScreen.Client_room_id !== 5) {
                waitingRoomScreen.active_slot = 5;
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-6',
        center_x: 760,
        center_y: 710,
        width: 350,
        height: 350,
        clicked: function () {
            if((waitingRoomScreen.user_slot[6] === false || waitingRoomScreen.Client_owner) && waitingRoomScreen.Client_room_id !== 6) {
                waitingRoomScreen.active_slot = 6;
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-7',
        center_x: 1160,
        center_y: 710,
        width: 350,
        height: 350,
        clicked: function () {
            if((waitingRoomScreen.user_slot[7] === false || waitingRoomScreen.Client_owner) && waitingRoomScreen.Client_room_id !== 7) {
                waitingRoomScreen.active_slot = 7;
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-8',
        center_x: 1560,
        center_y: 710,
        width: 350,
        height: 350,
        clicked: function () {
            if((waitingRoomScreen.user_slot[8] === false || waitingRoomScreen.Client_owner) && waitingRoomScreen.Client_room_id !== 8) {
                waitingRoomScreen.active_slot = 8;
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    });
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-pass-owner',
        center_x: 480,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            if(waitingRoomScreen.Client_owner && waitingRoomScreen.active_slot !== 0 && waitingRoomScreen.user_slot[waitingRoomScreen.active_slot] && waitingRoomScreen.active_slot !== waitingRoomScreen.Client_room_id){
                Screen.socket.emit('change owner', waitingRoomScreen.active_slot, (callback) => {
                    if(callback.status === 200){
                        console.log('change owner success');
                    }else{
                        Screen.alert.add_Data('server error', 'Something went wrong', 5);
                    }
                })
            }
        }
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-kick',
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            if(waitingRoomScreen.Client_owner && waitingRoomScreen.active_slot !== 0 && waitingRoomScreen.user_slot[waitingRoomScreen.active_slot] && waitingRoomScreen.active_slot !== waitingRoomScreen.Client_room_id){
                Screen.socket.emit('kick player', waitingRoomScreen.active_slot, (callback) => {
                    if(callback.status === 200){
                        console.log('kick player success');
                    }else{
                        Screen.alert.add_Data('server error', 'Something went wrong', 5);
                    }
                })
            }
        }
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-change-position',
        center_x: 960,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            if(waitingRoomScreen.user_slot[waitingRoomScreen.active_slot] === false && waitingRoomScreen.active_slot !== 0) {
                Screen.socket.emit('change player number', waitingRoomScreen.active_slot, (callback) => {
                    if (callback.status === 200) {

                    }else{
                        if(callback.message === 'already exist number'){
                            Screen.alert.add_Data('client error', 'Someone already use that number', 5);
                        }else{
                            Screen.alert.add_Data('client error', 'Something went wrong', 5);
                        }
                    }
                })
            }
        }
    })
    waitingRoomScreen.redrawBackground(Background_ctx);
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
    for(let i = 0; i < waitingRoomScreen.playerInfos.length; i++){
        let index = waitingRoomScreen.playerInfos[i].number;
        let center_x = ((index > 4) ? index - 4 : index) * 400 - 40;
        let center_y = (index > 4) ? 710 : 330;
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, center_x, center_y, 350, 350) && waitingRoomScreen.Client_owner && index !== waitingRoomScreen.Client_room_id){
            drawRoundBox(UI_ctx, center_x, center_y, 350 * 1.05, 350 * 1.05, Color_list[`player_${index}_inside_hex`], Color_list[`player_${index}_outside_hex`], 10 * 1.05, 25 * 1.05);
            drawText(UI_ctx, center_x-150, center_y-100, 100*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `${index}`, "left", "GmarketSansMedium");
            drawText(UI_ctx, center_x, center_y+50, 40 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `${waitingRoomScreen.playerInfos[i].name}`, "center", "GmarketSansMedium");
            if(waitingRoomScreen.playerInfos[i].role === 'owner'){
                drawText(UI_ctx, center_x, center_y+90, 30 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `(Owner)`, "center", "GmarketSansMedium");
            }else if(index === waitingRoomScreen.Client_room_id){
                drawText(UI_ctx, center_x, center_y+90, 30 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `(You)`, "center", "GmarketSansMedium");
            }
        }else{
            drawRoundBox(UI_ctx, center_x, center_y, 350, 350, Color_list[`player_${index}_inside_hex`], Color_list[`player_${index}_outside_hex`], 10, 25);
            drawText(UI_ctx, center_x-150, center_y-100, 100, 0, Color_list.text_default_hex, undefined, undefined, `${index}`, "left", "GmarketSansMedium");
            drawText(UI_ctx, center_x, center_y+50, 40, 0, Color_list.text_default_hex, undefined, undefined, `${waitingRoomScreen.playerInfos[i].name}`, "center", "GmarketSansMedium");
            if(waitingRoomScreen.playerInfos[i].role === 'owner'){
                drawText(UI_ctx, center_x, center_y+90, 30, 0, Color_list.text_default_hex, undefined, undefined, `(Owner)`, "center", "GmarketSansMedium");
            }else if(index === waitingRoomScreen.Client_room_id){
                drawText(UI_ctx, center_x, center_y+90, 30, 0, Color_list.text_default_hex, undefined, undefined, `(You)`, "center", "GmarketSansMedium");
            }
        }
    }
    for(let i = 1; i < 9; i++){
        let center_x = ((i > 4) ? i - 4 : i) * 400 - 40;
        let center_y = (i > 4) ? 710 : 330;
        if(waitingRoomScreen.user_slot[i] === false){
            if((checkTouch(Screen.userMouse.x, Screen.userMouse.y, center_x, center_y, 350, 350) && waitingRoomScreen.Client_room_id !== i) || waitingRoomScreen.active_slot === i) {
                drawRoundBox(UI_ctx, center_x, center_y, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, center_x-150, center_y-100, 100*1.05, 0, Color_list[`player_${i}_inside_hex`], Color_list[`player_${i}_outside_hex`], 5, `${i}`, "left", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, center_x, center_y, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
                drawText(UI_ctx, center_x-150, center_y-100, 100, 0, Color_list[`player_${i}_inside_hex`], Color_list[`player_${i}_outside_hex`], 5, `${i}`, "left", "GmarketSansMedium");
            }
        }
    }
    if(waitingRoomScreen.Client_owner){
        if(waitingRoomScreen.active_slot === 0){

        }else if(waitingRoomScreen.user_slot[waitingRoomScreen.active_slot]){
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 480, 990, 720, 120)) {
                drawRoundBox(UI_ctx, 480, 990, 720 * 1.05, 120 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, 480, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Pass Owner", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 480, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
                drawText(UI_ctx, 480, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Pass Owner", "center", "GmarketSansMedium");
            }
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120)) {
                drawRoundBox(UI_ctx, 1440, 990, 720 * 1.05, 120 * 1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, 1440, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Kick", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 1440, 990, 720, 120, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
                drawText(UI_ctx, 1440, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Kick", "center", "GmarketSansMedium");
            }
        }else{
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 990, 720, 120)) {
                drawRoundBox(UI_ctx, 960, 990, 720 * 1.05, 120 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, 960, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 960, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
                drawText(UI_ctx, 960, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
            }
        }
    }else{
        if(waitingRoomScreen.active_slot === 0){

        }else{
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 990, 720, 120)) {
                drawRoundBox(UI_ctx, 960, 990, 720 * 1.05, 120 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, 960, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 960, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
                drawText(UI_ctx, 960, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
            }
        }
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
            }
        }
        userMouse.click = false;
    }
    if(!waitingRoomScreen.touch_any_slot){
        waitingRoomScreen.active_slot = 0;
    }
}

export {waitingRoomScreen};