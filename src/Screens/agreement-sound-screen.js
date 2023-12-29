const agreementSoundScreen = {};
import {drawRoundBox} from "./tools/drawRoundBox";
import {drawText} from "./tools/drawText";
import {Color_list} from "../data/color_list";
import {checkTouch} from "./tools/checkTouch";
import {connectingSocketScreen} from "./connecting-socket-screen";

agreementSoundScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    agreementSoundScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0,0,1920,1080);
    agreementSoundScreen.checkUIList = [];
    agreementSoundScreen.checkUIList.push({
        tag: "agreement-sound-autoplay-confirm",
        center_x: 960,
        center_y: 900,
        width: 600,
        height: 150,
        clicked: function (){
            Screen.currentScreen = connectingSocketScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    })
};

agreementSoundScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0,0,1920,1080);
    drawRoundBox(UI_ctx, 960, 412.5, 1600, 645, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 20, 50);
    drawText(UI_ctx, 960, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "Audio Auto-Play Consent", "center", 'GmarketSansMedium');
    drawText(UI_ctx, 960, 400, 50, 0, Color_list.text_default_hex, undefined, undefined, "This web-game plays audio automatically.", "center", 'GmarketSansMedium');
    drawText(UI_ctx, 960, 500, 50, 0, Color_list.text_default_hex, undefined, undefined, "If you agree, please click the 'Confirm' button.", "center", 'GmarketSansMedium');
    drawText(UI_ctx, 960, 600, 50, 0, Color_list.text_default_hex, undefined, undefined, "If not, you can leave this website now.", "center", 'GmarketSansMedium');
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 900, 600, 150)){
        drawRoundBox(UI_ctx, 960, 900, 600*1.05, 150*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10, 30);
        drawText(UI_ctx, 960, 900, 50*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Confirm", "center", 'GmarketSansMedium');
    }else{
        drawRoundBox(UI_ctx, 960, 900, 600, 150, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 30);
        drawText(UI_ctx, 960, 900, 50, 0, Color_list.text_default_hex, undefined, undefined, "Confirm", "center", 'GmarketSansMedium');
    }
};

agreementSoundScreen.check = function (userMouse, userKeyboard, checkUIList) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height)) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
};

agreementSoundScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0,0,1920,1080);
};

export {agreementSoundScreen};