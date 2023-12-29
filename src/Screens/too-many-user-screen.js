const tooManyUserScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {Color_list} from "../data/color_list";
import {image} from "../data/image";

tooManyUserScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    tooManyUserScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0,0,1920,1080);
    tooManyUserScreen.checkUIList = [];
}

tooManyUserScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0,0,1920,1080);
    drawRoundBox(UI_ctx, 960, 540, 1600, 900, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 20, 50);
    drawText(UI_ctx, 960, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "Server Overloaded!", "center", 'GmarketSansMedium');
    drawText(UI_ctx, 960, 400, 50, 0, Color_list.text_default_hex, undefined, undefined, "There are too many users on our 'tiny little' server.", "center", 'GmarketSansMedium');
    drawText(UI_ctx, 960, 500, 50, 0, Color_list.text_default_hex, undefined, undefined, "Wait for other users to leave.", "center", 'GmarketSansMedium');
    drawText(UI_ctx, 960, 600, 50, 0, Color_list.text_default_hex, undefined, undefined, "Please refresh and try connecting again.", "center", 'GmarketSansMedium');
    UI_ctx.drawImage(image.server_overloaded, 810, 675, 300, 300);
};

tooManyUserScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0,0,1920,1080);
};

tooManyUserScreen.check = function (userMouse, userKeyboard, checkUIList) {
};

export {tooManyUserScreen};