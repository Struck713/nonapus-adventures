class HUDManager {

    constructor() {
        this.hudItems = [
            new InkRemainingProgressBar(15, 10, 12),
            new Minimap(GameManager.CANVAS_X - 75, 5)
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

class Minimap extends HUDItem {

    constructor(x, y) {
        super(x, y)
    }

    render() {

        console.log(levelManager.cell);

        this.map = createGraphics(LevelLayout.LEVEL_WIDTH * 7, LevelLayout.LEVEL_HEIGHT * 7);
        this.map.background(255);
        this.map.fill(0);
        this.map.strokeWeight(2);

        for (let x = 0; x < LevelLayout.LEVEL_WIDTH; x++) {
            for (let y = 0; y < LevelLayout.LEVEL_HEIGHT; y++) {
                let cell = levelManager.layout.getCell(x, y);
                let xOffset = x * 7;
                let yOffset = y * 7;

                if (cell.has(Cell.UP)) this.map.line(xOffset, yOffset, xOffset + 7, yOffset);
                if (cell.has(Cell.LEFT)) this.map.line(xOffset, yOffset, xOffset, yOffset + 7);
                if (cell.has(Cell.DOWN)) this.map.line(xOffset, yOffset + 7, xOffset + 7, yOffset + 7);
                if (cell.has(Cell.RIGHT)) this.map.line(xOffset + 7, yOffset, xOffset + 7, yOffset + 7);
                if (cell == levelManager.cell) {
                this.map.fill(0, 255, 0);
                this.map.square(xOffset, yOffset, 7);
                this.map.fill(0);
                }
            }
        }

        image(this.map, this.x, this.y);
    }

}