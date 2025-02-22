function drawImage(ctx, img, x, y, width, height) {
    ctx.drawImage(img, (x - width / 2) * ctx.displayDPI, (y - height / 2)*ctx.displayDPI, width * ctx.displayDPI, height * ctx.displayDPI);
}

export { drawImage };