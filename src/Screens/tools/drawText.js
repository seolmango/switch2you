/**
 * Function to draw text on the canvas
 * @param {CanvasRenderingContext2D} ctx - canvas context object to draw on
 * @param {number} x - x coordinate of the text
 * @param {number} y - y coordinate of the text
 * @param {number} size - size of the font
 * @param {number} rotate - angle of rotation in degrees (0-360)
 * @param {string | null | undefined} fillColor - color of the text
 * @param {string | null | undefined} strokeColor - color of the stroke
 * @param {number | null | undefined} strokeWidth - width of the stroke
 * @param {string} message - text to be drawn
 * @param {string} test_align - alignment of the text(left, right, center)
 * @param {string} font - font family
 */
const drawText = function (ctx, x, y, size, rotate, fillColor, strokeColor, strokeWidth, message, test_align, font) {
    ctx.save();
    ctx.beginPath();
    ctx.font = `${size * ctx.displayDPI}px ${font}`;
    ctx.textAlign = test_align;
    ctx.textBaseline = 'middle';
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    const messageLine = message.split('\n');
    if (fillColor) {
        ctx.fillStyle = fillColor;
        for(let i = 0; i < messageLine.length; i++) {
            ctx.fillText(messageLine[i], x * ctx.displayDPI, (y + (i * size * 1.6)) * ctx.displayDPI);
        }
    }
    if (strokeColor) {
        ctx.strokeWidth = strokeWidth * ctx.displayDPI;
        ctx.strokeStyle = strokeColor;
        for(let i = 0; i < messageLine.length; i++) {
            ctx.strokeText(messageLine[i], x * ctx.displayDPI, (y + (i * size * 1.6)) * ctx.displayDPI);
        }
    }
    ctx.restore();
};

export { drawText };