import {Color_list} from "../../data/color_list";

class checkboxElement {
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

    resize(scale, innerWidth, innerHeight) {
        this.DOM.style.width = this.width * scale + 'px';
        this.DOM.style.height = this.height * scale + 'px';
        this.DOM.style.left = ((innerWidth - (1920*scale)) / 2) + (this.x * scale) + 'px';
        this.DOM.style.top = ((innerHeight - (1080*scale)) / 2) + (this.y * scale) + 'px';
        this.DOM.style.transform = 'translate(-50%, -50%)';
    }

    show(active_list) {
        this.DOM.style.display = 'block';
        active_list.push(this);
        this.DOM.style.zIndex = 3;
        this.DOM.addEventListener('click', this.onclick);
    }

    hide(active_list) {
        this.DOM.style.display = 'none';
        active_list.splice(active_list.indexOf(this), 1);
        this.DOM.style.zIndex = 0;
        this.DOM.removeEventListener('click', this.onclick);
    }

    get_value() {
        return this.DOM.checked;
    }

    lock() {
        this.DOM.disabled = true;
    }

    unlock() {
        this.DOM.disabled = false;
    }
}

export {checkboxElement};