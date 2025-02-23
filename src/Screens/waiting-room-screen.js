const waitingRoomScreen = {};
import {Color_list} from "../data/color_list";
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {checkTouch} from "./tools/checkTouch";
import {viewServerListScreen} from "./view-server-list-screen";
import {image} from "../data/image";
import {clearCtx} from "./tools/clearCtx";
import {drawImage} from "./tools/drawImage";

let blue_1 = `rgba(${Color_list.button_blue_1_rgb[0]}, ${Color_list.button_blue_1_rgb[1]}, ${Color_list.button_blue_1_rgb[2]}, 0.5)`;
let blue_2 = `rgba(${Color_list.button_blue_2_rgb[0]}, ${Color_list.button_blue_2_rgb[1]}, ${Color_list.button_blue_2_rgb[2]}, 0.5)`;
let blue_text = `rgba(${Color_list.text_default_rgb[0]}, ${Color_list.text_default_rgb[1]}, ${Color_list.text_default_rgb[2]}, 0.5)`;
let red_1 = `rgba(${Color_list.button_red_1_rgb[0]}, ${Color_list.button_red_1_rgb[1]}, ${Color_list.button_red_1_rgb[2]}, 0.5)`;
let red_2 = `rgba(${Color_list.button_red_2_rgb[0]}, ${Color_list.button_red_2_rgb[1]}, ${Color_list.button_red_2_rgb[2]}, 0.5)`;
let red_text = `rgba(${Color_list.text_default_rgb[0]}, ${Color_list.text_default_rgb[1]}, ${Color_list.text_default_rgb[2]}, 0.5)`;

waitingRoomScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    Screen.join_room = true;
    waitingRoomScreen.gameroomInfo = Screen.gameroomInfo;
    if(typeof(history.pushState) != 'undefined'){
        let url = new URL(window.location.href);
        let urlParams = url.searchParams;
        urlParams.set('page', `room${Screen.gameroomInfo.id}`);
        history.pushState(null, null, url);
    }
    waitingRoomScreen.playerInfos = Screen.playerInfos;
    waitingRoomScreen.Client_room_id = Screen.Client_room_id;
    waitingRoomScreen.temp_player_skill = Screen.playerInfos[waitingRoomScreen.Client_room_id-1].skill;
    waitingRoomScreen.user_slot = [false, false, false, false, false, false, false, false, false];
    for(let i = 0; i < waitingRoomScreen.playerInfos.length; i++){
        waitingRoomScreen.user_slot[waitingRoomScreen.playerInfos[i].number] = true;
        if(waitingRoomScreen.playerInfos[i].number === Screen.Client_room_id){
            waitingRoomScreen.Client_owner = (waitingRoomScreen.playerInfos[i].role === 'owner') ? true : false;
            waitingRoomScreen.client_player = waitingRoomScreen.playerInfos[i];
        }
    }
    clearCtx(UI_ctx);
    waitingRoomScreen.checkUIList = [];
    waitingRoomScreen.active_slot = 0;
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
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-slot-1',
        center_x: 360,
        center_y: 330,
        width: 350,
        height: 350,
        clicked: function () {
            if(waitingRoomScreen.user_slot[1] === false || waitingRoomScreen.Client_owner || waitingRoomScreen.Client_room_id === 1) {
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
            if(waitingRoomScreen.user_slot[2] === false || waitingRoomScreen.Client_owner || waitingRoomScreen.Client_room_id === 2) {
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
            if(waitingRoomScreen.user_slot[3] === false || waitingRoomScreen.Client_owner || waitingRoomScreen.Client_room_id === 3) {
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
            if(waitingRoomScreen.user_slot[4] === false || waitingRoomScreen.Client_owner || waitingRoomScreen.Client_room_id === 4) {
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
            if(waitingRoomScreen.user_slot[5] === false || waitingRoomScreen.Client_owner || waitingRoomScreen.Client_room_id === 5) {
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
            if(waitingRoomScreen.user_slot[6] === false || waitingRoomScreen.Client_owner || waitingRoomScreen.Client_room_id === 6) {
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
            if(waitingRoomScreen.user_slot[7] === false || waitingRoomScreen.Client_owner || waitingRoomScreen.Client_room_id === 7) {
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
            if(waitingRoomScreen.user_slot[8] === false || waitingRoomScreen.Client_owner || waitingRoomScreen.Client_room_id === 8) {
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
                if(waitingRoomScreen.checkUIList[12].clickable > 0){
                    Screen.alert.add_Data('cooldown', 'Please wait for cooldown', 5);
                }else {
                    Screen.socket.emit('change player number', waitingRoomScreen.active_slot, (callback) => {
                        if (callback.status === 200) {
                            waitingRoomScreen.checkUIList[12].clickable = 10 * Screen.Settings.Display.fps;
                        } else {
                            if (callback.message === 'already exist number') {
                                Screen.alert.add_Data('client error', 'Someone already use that number', 5);
                            } else {
                                Screen.alert.add_Data('client error', 'Something went wrong', 5);
                            }
                        }
                    })
                }
            }
        },
        clickable: 10 * Screen.Settings.Display.fps
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-start-game',
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            if(waitingRoomScreen.Client_owner && waitingRoomScreen.active_slot === 0){
                if(waitingRoomScreen.checkUIList[13].clickable === 0){
                    Screen.socket.emit('start game', (callback) => {
                        if(callback.status === 200){
                            console.log('start game success');
                        }else{
                            if(callback.message === 'not enough player'){
                                Screen.alert.add_Data('not enough player', 'Need 3 or more players', 5);
                            }else{
                                Screen.alert.add_Data('server error', 'Something went wrong', 5);
                            }
                        }
                    })
                }else{
                    Screen.alert.add_Data('cooldown', 'Please wait for cooldown', 5);
                }
            }
        },
        clickable: 5 * Screen.Settings.Display.fps
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-skill-dash',
        center_x: 1100,
        center_y: 990,
        width: 120,
        height: 120,
        clicked: function () {
            if(waitingRoomScreen.active_slot === waitingRoomScreen.Client_room_id){
                waitingRoomScreen.temp_player_skill = 'dash';
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-skill-teleport',
        center_x: 1250,
        center_y: 990,
        width: 120,
        height: 120,
        clicked: function () {
            if(waitingRoomScreen.active_slot === waitingRoomScreen.Client_room_id){
                waitingRoomScreen.temp_player_skill = 'teleport';
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-skill-select',
        center_x: 1550,
        center_y: 990,
        width: 80,
        height: 80,
        clicked: function () {
            if(waitingRoomScreen.active_slot === waitingRoomScreen.Client_room_id){
                if(waitingRoomScreen.temp_player_skill !== waitingRoomScreen.client_player.skill){
                    Screen.socket.emit('change player skill', waitingRoomScreen.temp_player_skill, (callback) => {
                        if(callback.status === 200){

                        }else{
                            Screen.alert.add_Data('server error', 'Something went wrong', 5);
                        }
                    })
                }
            }
        }
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-skill-cancel',
        center_x: 1660,
        center_y: 990,
        width: 80,
        height: 80,
        clicked: function () {
            if(waitingRoomScreen.active_slot === waitingRoomScreen.Client_room_id){
                waitingRoomScreen.temp_player_skill = waitingRoomScreen.client_player.skill;
                waitingRoomScreen.touch_any_slot = true;
            }
        }
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-ready',
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            // if(waitingRoomScreen.active_slot === 0){
            //     if(!waitingRoomScreen.client_player.ready){
            //         if(waitingRoomScreen.checkUIList[18].clickable === 0){
            //             waitingRoomScreen.checkUIList[18].clickable = 10 * Screen.Settings.Display.fps;
            //             waitingRoomScreen.checkUIList[19].clickable = 10 * Screen.Settings.Display.fps;
            //             Screen.socket.emit('change player ready', true, (callback) => {
            //                 if(callback.status === 200){
            //                     console.log('ready success');
            //                 }else{
            //                     Screen.alert.add_Data('server error', 'Something went wrong', 5);
            //                 }
            //             })
            //         }else{
            //             Screen.alert.add_Data('cooldown', 'Please wait for cooldown', 5);
            //         }
            //     }
            // }
        },
        clickable: 5 * Screen.Settings.Display.fps
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-ready-cancel',
        center_x: 1440,
        center_y: 990,
        width: 720,
        height: 120,
        clicked: function () {
            // if(waitingRoomScreen.active_slot === 0){
            //     if(waitingRoomScreen.client_player.ready){
            //         if(waitingRoomScreen.checkUIList[19].clickable === 0){
            //             waitingRoomScreen.checkUIList[18].clickable = 10 * Screen.Settings.Display.fps;
            //             waitingRoomScreen.checkUIList[19].clickable = 10 * Screen.Settings.Display.fps;
            //             Screen.socket.emit('change player ready', false, (callback) => {
            //                 if(callback.status === 200){
            //                     console.log('cancel ready success');
            //                 }else{
            //                     Screen.alert.add_Data('server error', 'Something went wrong', 5);
            //                 }
            //             })
            //         }else{
            //             Screen.alert.add_Data('cooldown', 'Please wait for cooldown', 5);
            //         }
            //     }
            // }
        },
        clickable: 5 * Screen.Settings.Display.fps
    })
    waitingRoomScreen.checkUIList.push({
        tag: 'waiting-room-screen-map-change',
        center_x: 920,
        center_y: 990,
        width: 80,
        height: 80,
        clicked: function () {
            if(waitingRoomScreen.active_slot === 0 && waitingRoomScreen.Client_owner){
                if (waitingRoomScreen.checkUIList[20].clickable > 0) {
                    Screen.alert.add_Data('cooldown', 'Please wait for cooldown', 5);
                }else{
                    Screen.socket.emit('change room map', waitingRoomScreen.gameroomInfo.mapIndex+1, (callback) => {
                        if(callback.status === 200){
                            waitingRoomScreen.checkUIList[20].clickable = 2 * Screen.Settings.Display.fps;
                            waitingRoomScreen.checkUIList[13].clickable = 5 * Screen.Settings.Display.fps;
                        }else{
                            if(callback.message === 'wrong map'){
                                Screen.socket.emit('change room map', 0, (callback) => {
                                    if(callback.status === 200){
                                        waitingRoomScreen.checkUIList[20].clickable = 2 * Screen.Settings.Display.fps;
                                        waitingRoomScreen.checkUIList[13].clickable = 5 * Screen.Settings.Display.fps;
                                    }else{
                                        Screen.alert.add_Data('server error', 'Something went wrong', 5);
                                    }
                                })
                            }else{
                                Screen.alert.add_Data('server error', 'Something went wrong', 5);
                            }
                        }
                    })
                }
            }
        },
        clickable: 2 * Screen.Settings.Display.fps
    })
    console.log(waitingRoomScreen.gameroomInfo);
    waitingRoomScreen.redrawBackground(Background_ctx);
}

waitingRoomScreen.draw = function(Background_ctx, UI_ctx, Screen) {
    clearCtx(UI_ctx);
    if (checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96, UI_ctx.displayDPI)) {
        drawRoundBox(UI_ctx, 180, 72, 240 * 1.05, 96 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 180, 72, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    } else {
        drawRoundBox(UI_ctx, 180, 72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180, 72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }
    if (checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1740, 72, 300, 96, UI_ctx.displayDPI)) {
        drawRoundBox(UI_ctx, 1740, 72, 300 * 1.05, 96 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
        drawText(UI_ctx, 1740, 72, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Copy ID", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1740, 72, 300, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1740, 72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Copy ID", "center", "GmarketSansMedium");
    }
    // 플레이어 슬롯 그리기
    for(let i = 0; i < waitingRoomScreen.playerInfos.length; i++){
        let index = waitingRoomScreen.playerInfos[i].number;
        let center_x = ((index > 4) ? index - 4 : index) * 400 - 40;
        let center_y = (index > 4) ? 710 : 330;
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, center_x, center_y, 350, 350, UI_ctx.displayDPI) && (waitingRoomScreen.Client_owner || index === waitingRoomScreen.Client_room_id)){
            drawRoundBox(UI_ctx, center_x, center_y, 350 * 1.05, 350 * 1.05, Color_list.player_inside_colors[index-1], Color_list.player_outside_colors[index-1], 10 * 1.05, 25 * 1.05);
            drawText(UI_ctx, center_x-150, center_y-100, 100*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `${index}`, "left", "GmarketSansMedium");
            drawImage(UI_ctx, (waitingRoomScreen.playerInfos[i].skill === 'dash') ? image.skill_dash : image.skill_teleport, center_x+75*1.05, center_y-75*1.05, 150*1.05, 150*1.05)
            drawText(UI_ctx, center_x, center_y+50, 40 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `${waitingRoomScreen.playerInfos[i].name}`, "center", "GmarketSansMedium");
            if(waitingRoomScreen.playerInfos[i].device !== 'unknown'){
                drawImage(UI_ctx, (waitingRoomScreen.playerInfos[i].device === 'phone') ? image.mobile_icon : image.pc_icon, center_x, center_y+135*1.05, 40*1.05, 40*1.05)
            }
            if(waitingRoomScreen.playerInfos[i].role === 'owner'){
                drawText(UI_ctx, center_x, center_y+90, 30 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `(Owner)`, "center", "GmarketSansMedium");
            }else if(index === waitingRoomScreen.Client_room_id){
                drawText(UI_ctx, center_x, center_y+90, 30 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `(You)`, "center", "GmarketSansMedium");
            }
        }else{
            drawRoundBox(UI_ctx, center_x, center_y, 350, 350, Color_list.player_inside_colors[index-1], Color_list.player_outside_colors[index-1], 10, 25);
            drawText(UI_ctx, center_x-150, center_y-100, 100, 0, Color_list.text_default_hex, undefined, undefined, `${index}`, "left", "GmarketSansMedium");
            drawText(UI_ctx, center_x, center_y+50, 40, 0, Color_list.text_default_hex, undefined, undefined, `${waitingRoomScreen.playerInfos[i].name}`, "center", "GmarketSansMedium");
            drawImage(UI_ctx, (waitingRoomScreen.playerInfos[i].skill === 'dash') ? image.skill_dash : image.skill_teleport, center_x+75, center_y-75, 150, 150);
            if(waitingRoomScreen.playerInfos[i].device !== 'unknown'){
                drawImage(UI_ctx, (waitingRoomScreen.playerInfos[i].device === 'phone') ? image.mobile_icon : image.pc_icon, center_x, center_y+135, 40, 40)
            }
            if(waitingRoomScreen.playerInfos[i].role === 'owner'){
                drawText(UI_ctx, center_x, center_y+90, 30, 0, Color_list.text_default_hex, undefined, undefined, `(Owner)`, "center", "GmarketSansMedium");
            }else if(index === waitingRoomScreen.Client_room_id){
                drawText(UI_ctx, center_x, center_y+90, 30, 0, Color_list.text_default_hex, undefined, undefined, `(You)`, "center", "GmarketSansMedium");
            }
        }
    }
    // 빈 슬롯 그리기
    for(let i = 1; i < 9; i++){
        let center_x = ((i > 4) ? i - 4 : i) * 400 - 40;
        let center_y = (i > 4) ? 710 : 330;
        if(waitingRoomScreen.user_slot[i] === false){
            if((checkTouch(Screen.userMouse.x, Screen.userMouse.y, center_x, center_y, 350, 350, UI_ctx.displayDPI) && waitingRoomScreen.Client_room_id !== i) || waitingRoomScreen.active_slot === i) {
                drawRoundBox(UI_ctx, center_x, center_y, 350 * 1.05, 350 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, center_x-150, center_y-100, 100*1.05, 0, Color_list.player_inside_colors[i-1], Color_list.player_outside_colors[i-1], 5, `${i}`, "left", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, center_x, center_y, 350, 350, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
                drawText(UI_ctx, center_x-150, center_y-100, 100, 0, Color_list.player_inside_colors[i-1], Color_list.player_outside_colors[i-1], 5, `${i}`, "left", "GmarketSansMedium");
            }
        }
    }
    // UI 그리기
    if(waitingRoomScreen.Client_owner){
        //방장 일때(게임 시작, 권한 넘기기, 킥, 자리 바꾸기, 맵 변경)
        if(waitingRoomScreen.active_slot === 0){
            if(waitingRoomScreen.checkUIList[13].clickable === 0) {
                if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120, UI_ctx.displayDPI)) {
                    drawRoundBox(UI_ctx, 1440, 990, 720 * 1.05, 120 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
                    drawText(UI_ctx, 1440, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Start Game", "center", "GmarketSansMedium");
                }else{
                    drawRoundBox(UI_ctx, 1440, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
                    drawText(UI_ctx, 1440, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Start Game", "center", "GmarketSansMedium");
                }
            }else{
                drawRoundBox(UI_ctx, 1440, 990, 720, 120, blue_1, blue_2, 10, 25);
                drawText(UI_ctx, 1440, 990, 60, 0, blue_text, undefined, undefined, "Start Game", "center", "GmarketSansMedium");
            }
            drawText(UI_ctx, 185, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, `Map > ${waitingRoomScreen.gameroomInfo.mapName}`, "left", "GmarketSansMedium");
            if(waitingRoomScreen.checkUIList[20].clickable === 0) {
                if (checkTouch(Screen.userMouse.x, Screen.userMouse.y, 920, 990, 80, 80, UI_ctx.displayDPI)) {
                    drawRoundBox(UI_ctx, 920, 990, 80 * 1.05, 80 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
                    drawText(UI_ctx, 920, 990, 40 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, ">", "center", "GmarketSansMedium");
                } else {
                    drawRoundBox(UI_ctx, 920, 990, 80, 80, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
                    drawText(UI_ctx, 920, 990, 40, 0, Color_list.text_default_hex, undefined, undefined, ">", "center", "GmarketSansMedium");
                }
            }else{
                drawRoundBox(UI_ctx, 920, 990, 80, 80, blue_1, blue_2, 10, 25);
                drawText(UI_ctx, 920, 990, 40, 0, blue_text, undefined, undefined, ">", "center", "GmarketSansMedium");
            }
        }else if(waitingRoomScreen.user_slot[waitingRoomScreen.active_slot] && waitingRoomScreen.active_slot !== waitingRoomScreen.Client_room_id){
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 480, 990, 720, 120, UI_ctx.displayDPI)) {
                drawRoundBox(UI_ctx, 480, 990, 720 * 1.05, 120 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, 480, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Pass Owner", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 480, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
                drawText(UI_ctx, 480, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Pass Owner", "center", "GmarketSansMedium");
            }
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120, UI_ctx.displayDPI)) {
                drawRoundBox(UI_ctx, 1440, 990, 720 * 1.05, 120 * 1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, 1440, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Kick", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 1440, 990, 720, 120, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
                drawText(UI_ctx, 1440, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Kick", "center", "GmarketSansMedium");
            }
        }else if(waitingRoomScreen.active_slot !== waitingRoomScreen.Client_room_id){
            if(waitingRoomScreen.checkUIList[12].clickable > 0){
                drawRoundBox(UI_ctx, 960, 990, 720, 120, blue_1, blue_2, 10, 25);
                drawText(UI_ctx, 960, 990, 60, 0, blue_text, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
            }else {
                if (checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 990, 720, 120, UI_ctx.displayDPI)) {
                    drawRoundBox(UI_ctx, 960, 990, 720 * 1.05, 120 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
                    drawText(UI_ctx, 960, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
                } else {
                    drawRoundBox(UI_ctx, 960, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
                    drawText(UI_ctx, 960, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
                }
            }
        }
    }else{
        //방장이 아닐때(레디 버튼, 자리 바꾸기, 맵 표시)
        if(waitingRoomScreen.active_slot === 0){
            // Ready 버튼 (삭제된 기능)
            // if(waitingRoomScreen.client_player.ready){
            //     if(waitingRoomScreen.checkUIList[19].clickable > 0){
            //         drawRoundBox(UI_ctx, 1440, 990, 720, 120, red_1, red_2, 10, 25);
            //         drawText(UI_ctx, 1440, 990, 60, 0, red_text, undefined, undefined, "Cancel", "center", "GmarketSansMedium");
            //     }else{
            //         if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120)) {
            //             drawRoundBox(UI_ctx, 1440, 990, 720 * 1.05, 120 * 1.05, red_1, red_2, 10 * 1.05, 25 * 1.05);
            //             drawText(UI_ctx, 1440, 990, 60 * 1.05, 0, red_text, undefined, undefined, "Cancel", "center", "GmarketSansMedium");
            //         } else {
            //             drawRoundBox(UI_ctx, 1440, 990, 720, 120, red_1, red_2, 10, 25);
            //             drawText(UI_ctx, 1440, 990, 60, 0, red_text, undefined, undefined, "Cancel", "center", "GmarketSansMedium");
            //         }
            //     }
            // }else{
            //     if(waitingRoomScreen.checkUIList[18].clickable > 0){
            //         drawRoundBox(UI_ctx, 1440, 990, 720, 120, blue_1, blue_2, 10, 25);
            //         drawText(UI_ctx, 1440, 990, 60, 0, blue_text, undefined, undefined, "Ready", "center", "GmarketSansMedium");
            //     } else{
            //         if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1440, 990, 720, 120)){
            //             drawRoundBox(UI_ctx, 1440, 990, 720*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
            //             drawText(UI_ctx, 1440, 990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Ready", "center", "GmarketSansMedium");
            //         }else{
            //             drawRoundBox(UI_ctx, 1440, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
            //             drawText(UI_ctx, 1440, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Ready", "center", "GmarketSansMedium");
            //         }
            //     }
            // }
            drawText(UI_ctx, 185, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, `Map > ${waitingRoomScreen.gameroomInfo.mapName}`, "left", "GmarketSansMedium");
        }else if(waitingRoomScreen.active_slot !== waitingRoomScreen.Client_room_id){
            if(waitingRoomScreen.checkUIList[12].clickable > 0) {
                drawRoundBox(UI_ctx, 960, 990, 720, 120, blue_1, blue_2, 10, 25);
                drawText(UI_ctx, 960, 990, 60, 0, blue_text, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
            }else{
                if (checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 990, 720, 120, UI_ctx.displayDPI)) {
                    drawRoundBox(UI_ctx, 960, 990, 720 * 1.05, 120 * 1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10 * 1.05, 25 * 1.05);
                    drawText(UI_ctx, 960, 990, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
                } else {
                    drawRoundBox(UI_ctx, 960, 990, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
                    drawText(UI_ctx, 960, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Change Position", "center", "GmarketSansMedium");
                }
            }
        }
    }
    // 스킬 셋 변경 UI
    if(waitingRoomScreen.active_slot === waitingRoomScreen.Client_room_id){
        drawText(UI_ctx, 185, 990, 60, 0, (waitingRoomScreen.temp_player_skill !== waitingRoomScreen.client_player.skill) ? Color_list.button_blue_2_hex : Color_list.text_default_hex, undefined, undefined, `Skill > ${waitingRoomScreen.temp_player_skill}`, "left", "GmarketSansMedium");
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1100, 990, 120, 120, UI_ctx.displayDPI)){
            drawImage(UI_ctx, image.skill_dash, 1100, 990, 126, 126);
        }else{
            drawImage(UI_ctx, image.skill_dash, 1100, 990, 120, 120)
        }
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1250, 990, 120, 120, UI_ctx.displayDPI)){
            drawImage(UI_ctx, image.skill_teleport, 1250, 990, 126, 126);
        }else{
            drawImage(UI_ctx, image.skill_teleport, 1250, 990, 120, 120)
        }
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1550, 990, 80, 80, UI_ctx.displayDPI)){
            drawRoundBox(UI_ctx, 1550, 990, 80*1.05, 80*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 1550, 990, 50*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "✔", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 1550, 990, 80, 80, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
            drawText(UI_ctx, 1550, 990, 50, 0, Color_list.text_default_hex, undefined, undefined, "✔", "center", "GmarketSansMedium");
        }
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1660, 990, 80, 80, UI_ctx.displayDPI)){
            drawRoundBox(UI_ctx, 1660, 990, 80*1.05, 80*1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 1660, 990, 50*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "↺", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 1660, 990, 80, 80, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
            drawText(UI_ctx, 1660, 990, 50, 0, Color_list.text_default_hex, undefined, undefined, "↺", "center", "GmarketSansMedium");
        }
    }
}

waitingRoomScreen.redrawBackground = function (Background_ctx) {
    clearCtx(Background_ctx);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, `${waitingRoomScreen.gameroomInfo.name}`, "center", "GmarketSansMedium");
}

waitingRoomScreen.check = function (userMouse, userKeyboard, checkUIList, DPI){
    waitingRoomScreen.touch_any_slot = true;
    if(userMouse.click === true) {
        waitingRoomScreen.touch_any_slot = false;
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height, DPI)) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
    if(!waitingRoomScreen.touch_any_slot){
        waitingRoomScreen.active_slot = 0;
    }
    if(waitingRoomScreen.checkUIList[12].clickable > 0){
        waitingRoomScreen.checkUIList[12].clickable -= 1;
    }
    if(waitingRoomScreen.checkUIList[20].clickable > 0){
        waitingRoomScreen.checkUIList[20].clickable -= 1;
    }
    if(waitingRoomScreen.checkUIList[13].clickable > 0){
        waitingRoomScreen.checkUIList[13].clickable -= 1;
    }
}

export {waitingRoomScreen};