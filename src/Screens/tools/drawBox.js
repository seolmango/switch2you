/**
 * Draw a box on the canvas
 * @param {CanvasRenderingContext2D} ctx - canvas context object to draw on
 * @param {number} x - x coordinate of the top-left corner of the box
 * @param {number} y - y coordinate of the top-left corner of the box
 * @param {number} width - width of the box
 * @param {number} height - height of the box
 * @param {string} color - color of the box
 * @param {number} alpha - transparency of the box
 */
const drawBox = function (ctx, x, y, width, height, color, alpha) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
};

export { drawBox };