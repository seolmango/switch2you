/**
 * Draw a circle image on the canvas
 * @param {CanvasRenderingContext2D} ctx - canvas context object to draw on
 * @param {Image} img - image to be drawn
 * @param {number} x - x coordinate of the center of the circle
 * @param {number} y - y coordinate of the center of the circle
 * @param {number} r - radius of the circle
 */
const drawCircleImage = function (ctx, img, x, y, r){
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x-r, y-r, r*2, r*2);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.clip();
    ctx.closePath();
    ctx.restore();
}

export {drawCircleImage};