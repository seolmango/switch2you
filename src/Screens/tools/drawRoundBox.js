const drawRoundBox = function (ctx, x, y, width, height, fillColor, strokeColor, strokeWidth, arcRadius) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x - width * 0.5 + arcRadius, y - height * 0.5);
    ctx.lineTo(x + width * 0.5 - arcRadius, y - height * 0.5);
    ctx.arcTo(x + width * 0.5, y - height * 0.5, x + width * 0.5, y + height * 0.5, arcRadius);
    ctx.lineTo(x + width * 0.5, y + height * 0.5 - arcRadius);
    ctx.arcTo(x + width * 0.5, y + height * 0.5, x - width * 0.5, y + height * 0.5, arcRadius);
    ctx.lineTo(x - width * 0.5 + arcRadius, y + height * 0.5);
    ctx.arcTo(x - width * 0.5, y + height * 0.5, x - width * 0.5, y - height * 0.5, arcRadius);
    ctx.lineTo(x - width * 0.5, y - height * 0.5 + arcRadius);
    ctx.arcTo(x - width * 0.5, y - height * 0.5, x + width * 0.5, y - height * 0.5, arcRadius);
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    if (strokeColor) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }
    ctx.restore();
};

export { drawRoundBox };