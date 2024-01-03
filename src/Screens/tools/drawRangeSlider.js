import { drawCircle } from './drawCircle.js';
import {drawLine} from "./drawLine";

const drawRangeSlider = function (ctx, x, y, bar, circle, min, max, value) {
    drawLine(ctx, x-bar.lenght/2, y, x+bar.lenght/2, y, bar.color, bar.width);
    let position = (value-min)/(max-min) * bar.lenght;
    drawCircle(ctx, x + position - (bar.lenght/2), y, circle.radius, circle.color, circle.stroke_color, circle.stroke_width);
}

export {drawRangeSlider};