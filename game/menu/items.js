class MenuItem {
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hovered = false;
    }

    click() {}
    render() {}
    inBounds() { return false; }
}

class MenuButton extends MenuItem {

    constructor(x, y, width, height, text, action=(() => {})) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.text = text;
        this.hovered = false;
        this.action = action;
    }

    click() { this.action(); }

    render() {
        push();
        
        textAlign(CENTER);
        textSize(15);
        translate(this.x - (this.width / 2), this.y - (this.height / 2));
        
        fill(this.hovered ? 0 : 255);
        rect(0, 0, this.width, this.height);
        
        fill(this.hovered ? 255 : 0);
        text(this.text, (this.width / 2), (this.height / 2)+5);
        pop();
    }

    inBounds(x, y) {
        return Utils.inBounds(x, y, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
    }
}

class MenuText extends MenuItem {

    constructor(x, y, text, font, size) {
        super(x, y);
        this.text = text;
        this.font = font;
        this.size = size;
    }

    render() {
        push();
        textAlign(CENTER, CENTER);
        textSize(this.size);
        textFont(this.font);
        translate(this.x - (this.size / 2), this.y - (this.size / 2));
        fill(0);
        text(this.text, this.size, this.size);
        pop();
    }
}

class MenuImage extends MenuItem {

    constructor(x, y, name) {
        super(x, y);
        this.name = name;
    }
}