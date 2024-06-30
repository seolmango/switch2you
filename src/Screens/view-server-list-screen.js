const viewServerListScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {Color_list} from "../data/color_list";
import {checkTouch} from "./tools/checkTouch";
import {titleScreen} from "./title-screen";
import {drawLine} from "./tools/drawLine";
import {makeNewRoomScreen} from "./make-new-room-screen";
import {joinRoomWithIdScreen} from "./join-room-with-id-screen";
import {needNicknameScreen} from "./need-nickname-screen";
import {drawCircle} from "./tools/drawCircle";
import {clearCtx} from "./tools/clearCtx";

let refresh_1 = `rgba(${Color_list.button_red_1_rgb[0]}, ${Color_list.button_red_1_rgb[1]}, ${Color_list.button_red_1_rgb[2]}, 0.5)`;
let refresh_2 = `rgba(${Color_list.button_red_2_rgb[0]}, ${Color_list.button_red_2_rgb[1]}, ${Color_list.button_red_2_rgb[2]}, 0.5)`;
let refresh_text = `rgba(${Color_list.text_default_rgb[0]}, ${Color_list.text_default_rgb[1]}, ${Color_list.text_default_rgb[2]}, 0.5)`;

viewServerListScreen.room_data = null;
viewServerListScreen.room_data_max = null;
viewServerListScreen.room_data_index = 1;
viewServerListScreen.room_slot = [false,false,false,false,false,false];

function get_room_data (socket, index) {
    viewServerListScreen.room_data = null;
    viewServerListScreen.room_data_max = null;
    viewServerListScreen.room_data_index = index;
    viewServerListScreen.room_slot = [false,false,false,false,false,false];
    socket.emit('get room list', index, (callback) => {
        if(callback.status === 200){
            viewServerListScreen.room_data_max = callback.maxPage;
            viewServerListScreen.room_data = callback.roomInfos;
            for(let i=0; i<viewServerListScreen.room_data.length; i++){
                viewServerListScreen.room_slot[i] = true;
            }
        }else{
            if(callback.message === 'wrong page'){
                Screen.alert.add_Data('clienterror', 'something wrong with your client, please try again', 5);
            }else if(callback.message === 'no page'){
                if(index > 1){
                    get_room_data(socket, index - 1);
                }else{
                    viewServerListScreen.room_data_max = 1;
                    viewServerListScreen.room_data = [];
                }
            }else{
                Screen.alert.add_Data('clienterror', 'something wrong with your client, please try again', 5);
            }
        }
    })
}

viewServerListScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    viewServerListScreen.redrawBackground(Background_ctx);
    clearCtx(UI_ctx);
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
            if(Screen.currentScreen.checkUIList[1].clickable !== 0){
                Screen.alert.add_Data('cooldown', 'try again after 10 seconds', 5);
            }else{
                get_room_data(Screen.socket, 1);
                Screen.currentScreen.checkUIList[1].clickable = 10 * Screen.Settings.Display.fps;
            }
        },
        clickable: 10 * Screen.Settings.Display.fps
    });
    viewServerListScreen.checkUIList.push({
        tag: "view-server-list-screen-make-new-room",
        center_x: 320,
        center_y: 990,
        width: 600,
        height: 120,
        clicked: function () {
            Screen.currentScreen = makeNewRoomScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0
    });
    viewServerListScreen.checkUIList.push({
        tag: "view-server-list-screen-quick-join",
        center_x: 960,
        center_y: 990,
        width: 600,
        height: 120,
        clicked: function () {
            Screen.currentScreen = needNicknameScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0
    })
    viewServerListScreen.checkUIList.push({
        tag: "view-server-list-screen-join-room-id",
        center_x: 1600,
        center_y: 990,
        width: 600,
        height: 120,
        clicked: function () {
            Screen.currentScreen = joinRoomWithIdScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        },
        clickable: 0
    });
    viewServerListScreen.checkUIList.push({
        tag: 'view-server-list-screen-next-page',
        center_x: 1200,
        center_y: 850,
        width: 80,
        height: 80,
        clicked: function () {
            if(viewServerListScreen.checkUIList[5].clickable !== 0){
                Screen.alert.add_Data('cooldown', 'try again after 10 seconds', 5);
            }else{
                get_room_data(Screen.socket, viewServerListScreen.room_data_index + 1);
                viewServerListScreen.checkUIList[5].clickable = 10 * Screen.Settings.Display.fps;
            }
        },
        clickable: 10 * Screen.Settings.Display.fps
    });
    viewServerListScreen.checkUIList.push({
        tag: 'view-server-list-screen-previous-page',
        center_x: 720,
        center_y: 850,
        width: 80,
        height: 80,
        clicked: function () {
            if(viewServerListScreen.checkUIList[6].clickable !== 0){
                Screen.alert.add_Data('cooldown', 'try again after 10 seconds', 5);
            }else{
                get_room_data(Screen.socket, viewServerListScreen.room_data_index - 1);
                viewServerListScreen.checkUIList[6].clickable = 10 * Screen.Settings.Display.fps;
            }
        },
        clickable: 10 * Screen.Settings.Display.fps
    });
    viewServerListScreen.checkUIList.push({
        tag: 'view-server-list-screen-room-slot-1',
        center_x: 560,
        center_y: 250,
        width: 750,
        height: 200,
        clicked: function () {
            if(viewServerListScreen.room_slot[0]){
                Screen.currentScreen = joinRoomWithIdScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                joinRoomWithIdScreen.room_id_input.set_value(viewServerListScreen.room_data[0].id);
            }
        },
        clickable: 0
    })
    viewServerListScreen.checkUIList.push({
        tag: 'view-server-list-screen-room-slot-2',
        center_x: 1360,
        center_y: 250,
        width: 750,
        height: 200,
        clicked: function () {
            if(viewServerListScreen.room_slot[1]){
                Screen.currentScreen = joinRoomWithIdScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                joinRoomWithIdScreen.room_id_input.set_value(viewServerListScreen.room_data[1].id);
            }
        },
        clickable: 0
    })
    viewServerListScreen.checkUIList.push({
        tag: 'view-server-list-screen-room-slot-3',
        center_x: 560,
        center_y: 470,
        width: 750,
        height: 200,
        clicked: function () {
            if(viewServerListScreen.room_slot[2]){
                Screen.currentScreen = joinRoomWithIdScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                joinRoomWithIdScreen.room_id_input.set_value(viewServerListScreen.room_data[2].id);
            }
        },
        clickable: 0
    })
    viewServerListScreen.checkUIList.push({
        tag: 'view-server-list-screen-room-slot-4',
        center_x: 1360,
        center_y: 470,
        width: 750,
        height: 200,
        clicked: function () {
            if(viewServerListScreen.room_slot[3]){
                Screen.currentScreen = joinRoomWithIdScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                joinRoomWithIdScreen.room_id_input.set_value(viewServerListScreen.room_data[3].id);
            }
        },
        clickable: 0
    })
    viewServerListScreen.checkUIList.push({
        tag: 'view-server-list-screen-room-slot-5',
        center_x: 560,
        center_y: 690,
        width: 750,
        height: 200,
        clicked: function () {
            if(viewServerListScreen.room_slot[4]){
                Screen.currentScreen = joinRoomWithIdScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                joinRoomWithIdScreen.room_id_input.set_value(viewServerListScreen.room_data[4].id);
            }
        },
        clickable: 0
    })
    viewServerListScreen.checkUIList.push({
        tag: 'view-server-list-screen-room-slot-6',
        center_x: 1360,
        center_y: 690,
        width: 750,
        height: 200,
        clicked: function () {
            if(viewServerListScreen.room_slot[5]){
                Screen.currentScreen = joinRoomWithIdScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
                joinRoomWithIdScreen.room_id_input.set_value(viewServerListScreen.room_data[5].id);
            }
        },
        clickable: 0
    })
    viewServerListScreen.fps = Screen.Settings.Display.fps;
    get_room_data(Screen.socket, 1);
};

viewServerListScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    clearCtx(UI_ctx);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 180, 72, 240, 96, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 180, 72, 240*1.05, 96*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 180, 72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 180, 72, 240, 96, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 180, 72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Back", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 320, 990, 600, 120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 320, 990, 600*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 320, 990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Make New Room", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 320, 990, 600, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
        drawText(UI_ctx, 320, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Make New Room", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 990, 600, 120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 960, 990, 600*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 960, 990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Quick Join", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 960, 990, 600, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
        drawText(UI_ctx, 960, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Quick Join", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1600, 990, 600, 120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 1600, 990, 600*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 1600, 990, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Join Room with ID", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1600, 990, 600, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
        drawText(UI_ctx, 1600, 990, 60, 0, Color_list.text_default_hex, undefined, undefined, "Join Room with ID", "center", "GmarketSansMedium");
    }
    if(viewServerListScreen.checkUIList[1].clickable > 0){
        drawRoundBox(UI_ctx, 1700, 72, 320, 96, refresh_1, refresh_2, 10, 25);
        drawText(UI_ctx, 1700, 72, 60, 0, refresh_text, undefined, undefined, "Refresh", "center", "GmarketSansMedium");
    }else{
        if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1700, 72, 320, 96, UI_ctx.displayDPI)){
            drawRoundBox(UI_ctx, 1700, 72, 320*1.05, 96*1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10*1.05, 25*1.05);
            drawText(UI_ctx, 1700, 72, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Refresh", "center", "GmarketSansMedium");
        }else{
            drawRoundBox(UI_ctx, 1700, 72, 320, 96, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
            drawText(UI_ctx, 1700, 72, 60, 0, Color_list.text_default_hex, undefined, undefined, "Refresh", "center", "GmarketSansMedium");
        }
    }
    if(viewServerListScreen.room_data === null){
        let seconds = new Date().getSeconds();
        let milliseconds = new Date().getMilliseconds();
        drawText(UI_ctx, 960, 400, 70, 0, Color_list.text_default_hex, undefined, undefined, "Loading" + ".".repeat((seconds%3)+1), "center", 'GmarketSansMedium');
        let rad_delta = 2 * Math.PI * (milliseconds / 1000);
        let rads = [rad_delta, 2*Math.PI/5+rad_delta, 4*Math.PI/5+rad_delta, 6*Math.PI/5+rad_delta, 8*Math.PI/5+rad_delta];
        for (let i = 0; i < 5; i++) {
            drawCircle(UI_ctx, 960 + 70 * Math.cos(rads[i]), 640 + 70 * Math.sin(rads[i]), 10, Color_list.text_default_hex, undefined, undefined);
        }
    }else{
        drawText(UI_ctx, 1000, 850, 50, 0, Color_list.text_default_hex, undefined, undefined, `${viewServerListScreen.room_data_max}`, "center", 'GmarketSansMedium');
        drawText(UI_ctx, 920, 850, 50, 0, Color_list.text_default_hex, undefined, undefined, `${viewServerListScreen.room_data_index}`, "center", 'GmarketSansMedium');
        if(viewServerListScreen.checkUIList[5].clickable !== 0){
            drawRoundBox(UI_ctx, 1200, 850, 80, 80, refresh_1, refresh_2, 10, 25);
            drawText(UI_ctx, 1200, 850, 60, 0, refresh_text, undefined, undefined, ">", "center", "GmarketSansMedium");
        }else{
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1200, 850, 80, 80, UI_ctx.displayDPI)) {
                drawRoundBox(UI_ctx, 1200, 850, 80 * 1.05, 80 * 1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, 1200, 850, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, ">", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 1200, 850, 80, 80, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
                drawText(UI_ctx, 1200, 850, 60, 0, Color_list.text_default_hex, undefined, undefined, ">", "center", "GmarketSansMedium");
            }
        }
        if(viewServerListScreen.checkUIList[6].clickable !== 0) {
            drawRoundBox(UI_ctx, 720, 850, 80, 80, refresh_1, refresh_2, 10, 25);
            drawText(UI_ctx, 720, 850, 60, 0, refresh_text, undefined, undefined, "<", "center", "GmarketSansMedium");
        }else{
            if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 720, 850, 80, 80, UI_ctx.displayDPI)) {
                drawRoundBox(UI_ctx, 720, 850, 80 * 1.05, 80 * 1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10 * 1.05, 25 * 1.05);
                drawText(UI_ctx, 720, 850, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "<", "center", "GmarketSansMedium");
            }else{
                drawRoundBox(UI_ctx, 720, 850, 80, 80, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
                drawText(UI_ctx, 720, 850, 60, 0, Color_list.text_default_hex, undefined, undefined, "<", "center", "GmarketSansMedium");
            }
        }
        if(viewServerListScreen.room_data.length === 0) {
            drawText(UI_ctx, 960, 520, 50, 0, Color_list.text_default_hex, undefined, undefined, "No Room", "center", 'GmarketSansMedium');
        }else{
            for(let i=0; i<viewServerListScreen.room_data.length; i++){
                let loc_x = i % 2;
                let loc_y = Math.floor(i / 2);
                let x = 960 + (loc_x * 800) - 400;
                let y = 360 + (loc_y * 220) - 110;
                if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, x, y, 750, 200, UI_ctx.displayDPI)) {
                    drawRoundBox(UI_ctx, x, y, 750 * 1.05, 200 * 1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10 * 1.05, 25 * 1.05);
                    drawText(UI_ctx, x-350*1.05, y-55*1.05, 60 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `${viewServerListScreen.room_data[i].name}`, "left", 'GmarketSansMedium');
                    drawText(UI_ctx, x+350*1.05, y-55*1.05, 40 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `${viewServerListScreen.room_data[i].playerCount}/8`, "right", 'GmarketSansMedium');
                    drawText(UI_ctx, x-350*1.05, y-5*1.05, 40 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `${viewServerListScreen.room_data[i].ownerName}'s Room`, "left", 'GmarketSansMedium');
                    drawText(UI_ctx, x+350*1.05, y-5*1.05, 40*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `#${viewServerListScreen.room_data[i].id}`, "right", 'GmarketSansMedium');
                    drawText(UI_ctx, x-350*1.05, y+55, 40 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, (viewServerListScreen.room_data[i].passwordExist) ? 'password':'no password', "left", 'GmarketSansMedium');
                    drawText(UI_ctx, x+350*1.05, y+55, 40 * 1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, `now: ${(viewServerListScreen.room_data[i].playing) ? 'Playing':'waiting'}`, "right", 'GmarketSansMedium');
                }else {
                    drawRoundBox(UI_ctx, x, y, 750, 200, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
                    drawText(UI_ctx, x-350, y-55, 60, 0, Color_list.text_default_hex, undefined, undefined, `${viewServerListScreen.room_data[i].name}`, "left", 'GmarketSansMedium');
                    drawText(UI_ctx, x+350, y-55, 40, 0, Color_list.text_default_hex, undefined, undefined, `${viewServerListScreen.room_data[i].playerCount}/8`, "right", 'GmarketSansMedium');
                    drawText(UI_ctx, x-350, y-5, 40, 0, Color_list.text_default_hex, undefined, undefined, `${viewServerListScreen.room_data[i].ownerName}'s Room`, "left", 'GmarketSansMedium');
                    drawText(UI_ctx, x+350, y-5, 40, 0, Color_list.text_default_hex, undefined, undefined, `#${viewServerListScreen.room_data[i].id}`, "right", 'GmarketSansMedium');
                    drawText(UI_ctx, x-350, y+55, 40, 0, Color_list.text_default_hex, undefined, undefined, (viewServerListScreen.room_data[i].passwordExist) ? 'password':'no password', "left", 'GmarketSansMedium');
                    drawText(UI_ctx, x+350, y+55, 40, 0, Color_list.text_default_hex, undefined, undefined, `now: ${(viewServerListScreen.room_data[i].playing) ? 'Playing':'waiting'}`, "right", 'GmarketSansMedium');
                }
            }
        }
    }
};

viewServerListScreen.redrawBackground = function (Background_ctx) {
    clearCtx(Background_ctx);
    drawText(Background_ctx, 960, 72, 80, 0, Color_list.text_default_hex, undefined, undefined, "Room List", "center", "GmarketSansMedium");
    drawRoundBox(Background_ctx, 960, 520, 1600, 760, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 50);
    drawLine(Background_ctx, 950, 875, 970, 825, Color_list.button_gray_3_hex, 10);
};

viewServerListScreen.check = function (userMouse, userKeyboard, checkUIList, DPI) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height, DPI)) {
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
    if(viewServerListScreen.room_data === null){
        checkUIList[5].clickable = 10 * viewServerListScreen.fps;
        checkUIList[6].clickable = 10 * viewServerListScreen.fps;
    }else{
        if(viewServerListScreen.room_data_index === 1){
            checkUIList[6].clickable = 10 * viewServerListScreen.fps;
        }
        if(viewServerListScreen.room_data_index === viewServerListScreen.room_data_max){
            checkUIList[5].clickable = 10 * viewServerListScreen.fps;
        }
    }
};

export {viewServerListScreen};