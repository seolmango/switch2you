const tooManyUserScreen = {};
import {drawText} from "./tools/drawText";
import {drawRoundBox} from "./tools/drawRoundBox";
import {Color_list} from "../data/color_list";
import {image} from "../data/image";
import {drawImage} from "./tools/drawImage";
import {clearCtx} from "./tools/clearCtx";

tooManyUserScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    tooManyUserScreen.redrawBackground(Background_ctx);
    clearCtx(UI_ctx);
    tooManyUserScreen.checkUIList = [];
}

tooManyUserScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    clearCtx(UI_ctx);
};

tooManyUserScreen.redrawBackground = function (Background_ctx) {
    clearCtx(Background_ctx);
    drawRoundBox(Background_ctx, 960, 540, 1600, 900, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 20, 50);
    drawText(Background_ctx, 960, 200, 70, 0, Color_list.text_default_hex, undefined, undefined, "Server Overloaded!", "center", 'GmarketSansMedium');
    drawText(Background_ctx, 960, 400, 50, 0, Color_list.text_default_hex, undefined, undefined, "There are too many users on our 'tiny little' server.", "center", 'GmarketSansMedium');
    drawText(Background_ctx, 960, 500, 50, 0, Color_list.text_default_hex, undefined, undefined, "Wait for other users to leave.", "center", 'GmarketSansMedium');
    drawText(Background_ctx, 960, 600, 50, 0, Color_list.text_default_hex, undefined, undefined, "Please refresh and try connecting again.", "center", 'GmarketSansMedium');
    drawImage(Background_ctx, image.server_overloaded, 960, 825, 300, 300);
};

tooManyUserScreen.check = function (userMouse, userKeyboard, checkUIList, DPI) {
};

export {tooManyUserScreen};