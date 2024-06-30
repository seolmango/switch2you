const drawCircleImage = function (ctx, img, x, y, r){
    ctx.save();
    ctx.beginPath();
    ctx.arc(x * ctx.displayDPI, y * ctx.displayDPI, r * ctx.displayDPI, 0, 2*Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, (x-r) * ctx.displayDPI, (y-r) * ctx.displayDPI, r*2*ctx.displayDPI, r*2*ctx.displayDPI);
    ctx.beginPath();
    ctx.arc(x * ctx.displayDPI, y * ctx.displayDPI, r * ctx.displayDPI, 0, 2*Math.PI);
    ctx.clip();
    ctx.closePath();
    ctx.restore();
}

export {drawCircleImage};