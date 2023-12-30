class textInputElement {
    constructor(DOM_id, x, y, width, height, font_size, border_color, check) {
        this.DOM = document.getElementById(DOM_id);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.font_size = font_size;
        this.border_color = border_color;
        this.check = check;
    }

    resize(scale, innerWidth, innerHeight) {
        this.DOM.style.width = this.width * scale + 'px';
        this.DOM.style.height = this.height * scale + 'px';
        this.DOM.style.fontSize = this.font_size * scale + 'px';
        this.DOM.style.left = ((innerWidth - (1920*scale)) / 2) + (this.x * scale) + 'px';
        this.DOM.style.top = ((innerHeight - (1080*scale)) / 2) + (this.y * scale) + 'px';
        this.DOM.style.transform = 'translate(-50%, -50%)';
    }

    show(active_list) {
        this.DOM.style.display = 'block';
        active_list.push(this);
    }

    hide(active_list) {
        this.DOM.style.display = 'none';
        active_list.splice(active_list.indexOf(this), 1);
    }

    get_value() {
        return this.DOM.value;
    }

    set_value(value) {
        this.DOM.value = value;
    }

    check_value() {
        return this.check(this.DOM.value);
    }
}