/**
 * Function to draw rounded box on the canvas
 * @param {CanvasRenderingContext2D} ctx - canvas context object to draw on
 * @param {number} x - x coordinate of the center of the box
 * @param {number} y - y coordinate of the center of the box
 * @param {number} width - width of the box
 * @param {number} height - height of the box
 * @param {string | null | undefined} fillColor - inside color of the box
 * @param {string | null | undefined} strokeColor - color of the stroke
 * @param {number | null | undefined} strokeWidth - width of the stroke
 * @param {number} arcRadius - radius of the arc(Roundness of the box)
 */
const drawRoundBox = function (ctx, x, y, width, height, fillColor, strokeColor, strokeWidth, arcRadius) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo((x - width * 0.5 + arcRadius)*ctx.displayDPI, (y - height * 0.5)*ctx.displayDPI);
    ctx.lineTo((x + width * 0.5 - arcRadius)*ctx.displayDPI, (y - height * 0.5)*ctx.displayDPI);
    ctx.arcTo((x + width * 0.5)*ctx.displayDPI, (y - height * 0.5)*ctx.displayDPI, (x + width * 0.5)*ctx.displayDPI, (y + height * 0.5)*ctx.displayDPI, arcRadius*ctx.displayDPI);
    ctx.lineTo((x + width * 0.5)*ctx.displayDPI, (y + height * 0.5 - arcRadius)*ctx.displayDPI);
    ctx.arcTo((x + width * 0.5)*ctx.displayDPI, (y + height * 0.5)*ctx.displayDPI, (x - width * 0.5)*ctx.displayDPI, (y + height * 0.5)*ctx.displayDPI, arcRadius*ctx.displayDPI);
    ctx.lineTo((x - width * 0.5 + arcRadius)*ctx.displayDPI, (y + height * 0.5)*ctx.displayDPI);
    ctx.arcTo((x - width * 0.5)*ctx.displayDPI, (y + height * 0.5)*ctx.displayDPI, (x - width * 0.5)*ctx.displayDPI, (y - height * 0.5)*ctx.displayDPI, arcRadius*ctx.displayDPI);
    ctx.lineTo((x - width * 0.5)*ctx.displayDPI, (y - height * 0.5 + arcRadius)*ctx.displayDPI);
    ctx.arcTo((x - width * 0.5)*ctx.displayDPI, (y - height * 0.5)*ctx.displayDPI, (x + width * 0.5)*ctx.displayDPI, (y - height * 0.5)*ctx.displayDPI, arcRadius*ctx.displayDPI);
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    if (strokeColor) {
        ctx.lineWidth = strokeWidth * ctx.displayDPI;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }
    ctx.restore();
};

export { drawRoundBox };