const drawText = function (ctx, x, y, size, rotate, fillColor, strokeColor, strokeWidth, message, test_align, font) {
    ctx.save();
    ctx.beginPath();
    ctx.font = `${size}px ${font}`;
    ctx.textAlign = test_align;
    ctx.textBaseline = 'middle';
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    const messageLine = message.split('\n');
    if (fillColor) {
        ctx.fillStyle = fillColor;
        for(let i = 0; i < messageLine.length; i++) {
            ctx.fillText(messageLine[i], x, y + (i * size * 1.6));
        }
    }
    if (strokeColor) {
        ctx.strokeWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        for(let i = 0; i < messageLine.length; i++) {
            ctx.strokeText(messageLine[i], x, y + (i * size * 1.6));
        }
    }
    ctx.restore();
};

export { drawText };