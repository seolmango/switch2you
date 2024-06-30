const drawBox = function (ctx, x, y, width, height, color, alpha) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x * ctx.displayDPI, y * ctx.displayDPI, width * ctx.displayDPI, height * ctx.displayDPI);
    ctx.restore();
};

export { drawBox };