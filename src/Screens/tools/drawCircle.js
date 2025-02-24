/**
 * Draw a circle on the canvas
 * @param {CanvasRenderingContext2D} ctx - canvas context object to draw on
 * @param {number} x - x coordinate of the center of the circle
 * @param {number} y - y coordinate of the center of the circle
 * @param {number} radius - radius of the circle
 * @param {string | null | undefined} fillColor - inside color of the circle
 * @param {string | null | undefined} strokeColor - color of the stroke
 * @param {number | null | undefined} strokeWidth - width of the stroke
 */
const drawCircle = function (ctx, x, y, radius, fillColor, strokeColor, strokeWidth) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x * ctx.displayDPI, y * ctx.displayDPI, radius * ctx.displayDPI, 0, 2 * Math.PI);
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth * ctx.displayDPI;
        ctx.stroke();
    }
    ctx.restore();
};

export { drawCircle };