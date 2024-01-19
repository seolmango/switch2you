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