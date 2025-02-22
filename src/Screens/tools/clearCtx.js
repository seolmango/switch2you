function clearCtx(ctx) {
    ctx.clearRect(0,0,1920 * ctx.displayDPI,1080 * ctx.displayDPI);
}

module.exports = { clearCtx }