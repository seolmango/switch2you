const titleScreen = {};
import { image } from "../data/image";
import { drawRoundBox } from "./tools/drawRoundBox";
import { drawText } from "./tools/drawText";
import { checkTouch} from "./tools/checkTouch";
import { Color_list} from "../data/color_list";

titleScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    titleScreen.redrawBackground(Background_ctx);
    UI_ctx.clearRect(0,0,1920,1080);
    titleScreen.checkUIList = [];
    titleScreen.checkUIList.push({
        tag: "start game",
        center_x: 960,
        center_y: 540,
        width: 300,
        height: 100,
        clicked: function (){
            console.log("start game");
        }
    });
    titleScreen.checkUIList.push({
        tag: "setting",
        center_x: 960,
        center_y: 700,
        width: 300,
        height: 100,
        clicked: function (){
            console.log("setting");
        }
    });
};

titleScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0,0,1920,1080);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 540, 300, 100)) {
        drawRoundBox(UI_ctx, 960, 540, 300*1.05, 100*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10, 5);
        drawText(UI_ctx,960, 540, 50, 0, Color_list.button_gray_3_hex, undefined, undefined, "start game", "center", "");
    } else {
        drawRoundBox(UI_ctx, 960, 540, 300, 100, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 5);
        drawText(UI_ctx,960, 540, 50, 0, Color_list.button_gray_3_hex, undefined, undefined, "start game", "center", "");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 700, 300, 100)) {
        drawRoundBox(UI_ctx, 960, 700, 300*1.05, 100*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10, 5);
        drawText(UI_ctx,960, 700, 50, 0, Color_list.button_gray_3_hex, undefined, undefined, "setting", "center", "");
    } else {
        drawRoundBox(UI_ctx, 960, 700, 300, 100, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 5);
        drawText(UI_ctx,960, 700, 50, 0, Color_list.button_gray_3_hex, undefined, undefined, "setting", "center", "");
    }
};

titleScreen.check = function (userMouse, userKeyboard, checkUIList) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height)) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
};

titleScreen.redrawBackground = function (Background_ctx) {
    Background_ctx.clearRect(0,0,1920,1080);
    Background_ctx.drawImage(image.title_logo, 618, 0, 684, 300);
};

export { titleScreen };