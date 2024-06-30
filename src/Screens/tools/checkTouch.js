const checkTouch = function (mouseX, mouseY, x, y, width, height, displayDPI) {
    x = x * displayDPI;
    y = y * displayDPI;
    width = width * displayDPI;
    height = height * displayDPI;
    const deltaX = mouseX - x;
    const deltaY = mouseY - y;
    if (deltaX >= width * -0.5 && deltaX <= width * 0.5 && deltaY >= height * -0.5 && deltaY <= height * 0.5) {
        return true;
    } else {
        return false;
    }
};

export { checkTouch };