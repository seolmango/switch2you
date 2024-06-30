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