class HUDManager {

    constructor() {
        this.hudItems = [
            new InkRemainingProgressBar(15, 10, 12),
        ];
    }

    render() {
        this.hudItems.forEach(hudItem => hudItem.render());
    }
a
}

class HUDItem {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    render() {

    }

}

class TextItem extends HUDItem {

    constructor(x, y, text, size) {
        super(x, y);
        this.text = text;
        this.size = size;
    } 

    render() {
        textSize(this.size);
        fill(255);
        text(this.text, this.x, this.y);
    }

}

class InkRemainingProgressBar extends HUDItem {

    constructor(x, y) {
        super(x, y);
    }

    render() {
    
        if (!this.character) {
            this.character = gameManager.getByTag(Character.TAG);
        }

        fill(0);
        rect(this.x, this.y, 100, 25)
        fill(161, 33, 240);
        rect(this.x, this.y, this.character.inkLeft * (100 / Character.INK_DEFAULT_VALUE), 25);
    }

}