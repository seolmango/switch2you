const drawLine = function (ctx, x1, y1, x2, y2, color, lineWidth) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * ctx.displayDPI;
    ctx.moveTo(x1 * ctx.displayDPI, y1 * ctx.displayDPI);
    ctx.lineTo(x2 * ctx.displayDPI, y2 * ctx.displayDPI);
    ctx.stroke();
    ctx.restore();
};

export { drawLine };