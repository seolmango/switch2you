import { drawCircle } from './drawCircle.js';
import {drawLine} from "./drawLine";

/**
 * Draw a range slider on the canvas
 * @param {CanvasRenderingContext2D} ctx - canvas context object to draw on
 * @param {number} x - x coordinate of the center of the slider
 * @param {number} y - y coordinate of the center of the slider
 * @param {{width:number, color:string, stroke_width: number}} bar - object containing properties of the bar
 * @param {{radius:number, color:string, stroke_color: string, stroke_width: number}} circle - object containing properties of the circle
 * @param {number} min - minimum value of the slider
 * @param {number} max - maximum value of the slider
 * @param {number} value - current value of the slider
 */
const drawRangeSlider = function (ctx, x, y, bar, circle, min, max, value) {
    drawLine(ctx, x-bar.width/2, y, x+bar.width/2, y, bar.color, bar.stroke_width);
    let position = (value-min)/(max-min) * bar.width;
    drawCircle(ctx, x + position - (bar.width/2), y, circle.radius, circle.color, circle.stroke_color, circle.stroke_width);
}

export {drawRangeSlider};