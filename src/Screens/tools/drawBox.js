const drawBox = function (ctx, x, y, width, height, color, alpha) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
};

export { drawBox };