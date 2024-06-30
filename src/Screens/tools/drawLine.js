/**
 * Draw a line on the canvas
 * @param {CanvasRenderingContext2D} ctx - canvas context object to draw on
 * @param {number} x1 - x coordinate of the start point of the line
 * @param {number} y1 - y coordinate of the start point of the line
 * @param {number} x2 - x coordinate of the end point of the line
 * @param {number} y2 - y coordinate of the end point of the line
 * @param {string} color - color of the line
 * @param {number} lineWidth - width of the line
 */
const drawLine = function (ctx, x1, y1, x2, y2, color, lineWidth) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
};

export { drawLine };