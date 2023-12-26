const titleScreen = {};
import { image } from "../data/image";
import { drawRoundBox } from "./tools/drawRoundBox";
import { drawText } from "./tools/drawText";
import { checkTouch} from "./tools/checkTouch";
import { Color_list} from "../data/color_list";

titleScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    Background_ctx.clearRect(0,0,1920,1080);
    UI_ctx.clearRect(0,0,1920,1080);
    Background_ctx.drawImage(image.title_logo, 618, 0, 684, 300);
    titleScreen.checkUIList = [];
};

titleScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    UI_ctx.clearRect(0,0,1920,1080);
};

titleScreen.check = function (userMouse, userKeyboard, checkUIList) {

};

export { titleScreen };