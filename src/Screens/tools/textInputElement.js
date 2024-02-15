/**
 * Class representing a text input html element
 */
class textInputElement {
    /**
     * Create a text input class
     * @param {string} DOM_id - id of the text input element in the HTML file
     * @param {number} x - x coordinate of the center of the text input
     * @param {number} y - y coordinate of the center of the text input
     * @param {number} width - width of the text input
     * @param {number} height - height of the text input
     * @param {number} font_size - font size of the text input
     * @param {string} border_color - border color of the text input
     * @param {string} background - background color of the text input
     * @param {function} check - function to check the value of the text input
     */
    constructor(DOM_id, x, y, width, height, font_size, border_color, background, check) {
        this.DOM = document.getElementById(DOM_id);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.font_size = font_size;
        this.border_color = border_color;
        this.background = background;
        this.check = check;
        this.DOM.style.borderBottomStyle = `5px solid ${border_color}`;
        this.DOM.style.backgroundColor = background;
    }

    /**
     * Resize the text input element
     * @param {number} scale - scale of the window size compared to the original size {1920, 1080)
     * @param {number} innerWidth - the gap between the client window and canvas in the x direction
     * @param {number} innerHeight - the gap between the client window and canvas in the y direction
     */
    resize(scale, innerWidth, innerHeight) {
        this.DOM.style.width = this.width * scale + 'px';
        this.DOM.style.height = this.height * scale + 'px';
        this.DOM.style.fontSize = this.font_size * scale + 'px';
        this.DOM.style.left = ((innerWidth - (1920*scale)) / 2) + (this.x * scale) + 'px';
        this.DOM.style.top = ((innerHeight - (1080*scale)) / 2) + (this.y * scale) + 'px';
        this.DOM.style.transform = 'translate(-50%, -50%)';
    }

    /**
     * Show the text input element
     * @param {Array} active_list - list of active html class
     */
    show(active_list) {
        this.DOM.style.display = 'block';
        active_list.push(this);
        this.DOM.style.zIndex = 3;
    }

    /**
     * Hide the text input element
     * @param {Array} active_list - list of active html class
     */
    hide(active_list) {
        this.DOM.style.display = 'none';
        active_list.splice(active_list.indexOf(this), 1);
        this.DOM.style.zIndex = 0;
    }

    /**
     * Get the value of the text input
     * @returns {*}
     */
    get_value() {
        return this.DOM.value;
    }

    /**
     * Set the value of the text input
     * @param value
     */
    set_value(value) {
        this.DOM.value = value;
    }

    /**
     * Check the value of the text input
     * @returns {boolean}
     */
    check_value() {
        return this.check(this.DOM.value);
    }

    /**
     * Lock the text input
     */
    lock() {
        this.DOM.disabled = true;
    }

    /**
     * Unlock the text input
     */
    unlock() {
        this.DOM.disabled = false;
    }
}

export {textInputElement};