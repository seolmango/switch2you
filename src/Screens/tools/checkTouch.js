/**
 * Check if the mouse is touching a certain area
 * @param {number} mouseX - x coordinate of the mouse
 * @param {number} mouseY - y coordinate of the mouse
 * @param {number} x - x coordinate of the center of the area
 * @param {number} y - y coordinate of the center of the area
 * @param {number} width - width of the area
 * @param {number} height - height of the area
 * @returns {boolean}
 */
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