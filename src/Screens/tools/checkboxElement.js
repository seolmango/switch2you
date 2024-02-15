import {Color_list} from "../../data/color_list";

/**
 * Class representing a checkbox html element
 */
class checkboxElement {
    /**
     * Create a checkbox class
     * @param {string} DOM_ID - id of the checkbox element in the HTML file
     * @param {number} x - x coordinate of the center of the checkbox
     * @param {number} y - y coordinate of the center of the checkbox
     * @param {number} width - width of the checkbox
     * @param {number} height - height of the checkbox
     * @param {string} background - background color of the checkbox
     * @param {function} onclick - function to be called when the checkbox is clicked
     */
    constructor(DOM_ID, x, y, width, height, background,onclick) {
        this.DOM = document.getElementById(DOM_ID);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.background = background;
        this.onclick = onclick;
        this.DOM.style.accentColor = background;
        this.DOM.style.backgroundColor = background;
        this.DOM.style.borderColor = Color_list.button_gray_3_hex;
    }

    /**
     * Resize the checkbox element
     * @param {number} scale - scale of the window size compared to the original size {1920, 1080)
     * @param {number} innerWidth - the gap between the client window and canvas in the x direction
     * @param {number} innerHeight - the gap between the client window and canvas in the y direction
     */
    resize(scale, innerWidth, innerHeight) {
        this.DOM.style.width = this.width * scale + 'px';
        this.DOM.style.height = this.height * scale + 'px';
        this.DOM.style.left = ((innerWidth - (1920*scale)) / 2) + (this.x * scale) + 'px';
        this.DOM.style.top = ((innerHeight - (1080*scale)) / 2) + (this.y * scale) + 'px';
        this.DOM.style.transform = 'translate(-50%, -50%)';
    }

    /**
     * Show the checkbox element
     * @param {Array} active_list - list of active html class
     */
    show(active_list) {
        this.DOM.style.display = 'block';
        active_list.push(this);
        this.DOM.style.zIndex = 3;
        this.DOM.addEventListener('click', this.onclick);
    }

    /**
     * Hide the checkbox element
     * @param {Array} active_list - list of active html class
     */
    hide(active_list) {
        this.DOM.style.display = 'none';
        active_list.splice(active_list.indexOf(this), 1);
        this.DOM.style.zIndex = 0;
        this.DOM.removeEventListener('click', this.onclick);
    }

    /**
     * Get the value of the checkbox
     * @returns {boolean} - value of the checkbox
     */
    get_value() {
        return this.DOM.checked;
    }

    /**
     * Lock the checkbox
     */
    lock() {
        this.DOM.disabled = true;
    }

    /**
     * Unlock the checkbox
     */
    unlock() {
        this.DOM.disabled = false;
    }
}

export {checkboxElement};