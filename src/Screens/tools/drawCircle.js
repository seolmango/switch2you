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