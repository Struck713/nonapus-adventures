class HUDManager {

    constructor() {
        this.hudItems = [
            new DebugStatsItem(5, 15, 12)
        ];
    }

    render() {
        this.hudItems.forEach(hudItem => hudItem.render());
    }

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

class DebugStatsItem extends HUDItem {

    constructor(x, y, size) {
        super(x, y);
        this.size = size;
    }

    render() {

        if (!this.characterPosition) {
            let character = gameManager.getByTag(Character.TAG);
            this.characterPosition = character.position;
        }

        textSize(this.size);
        fill(255);
        text(
              `Frame Rate: ${frameRate()}\n`
            + `Character Position: (${this.characterPosition.x}, ${this.characterPosition.y})`, 
            this.x, 
            this.y);
    }

}