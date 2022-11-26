class MenuManager {

    constructor () {
        this.active = false;
        this.menus = [
            new Menu([ new MenuButton(15, 15, 150, 50, "Play") ])
        ];
        this.current = this.menus[0];
    }

    render() {
        this.current.render();
    }

    mouseClick(x, y) {

    }

    mouseHover(x, y) {
        
    }

}

class Menu {

    constructor(items) {
        this.items = items;
    }

    render() {
        this.items.forEach(item => item.render());
    }

}

class MenuButton {

    constructor(x, y, width, height, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
    }

    render() {
        push();
        textAlign(CENTER);
        textSize(15);
        translate(this.x, this.y);
        rect(0, 0, this.width, this.height);
        text(this.text, (this.width / 2), (this.height / 2));
        pop();
    }

}