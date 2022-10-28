class HUDManager {

    constructor() {
        this.hudItems = [
            new InkRemainingProgressBar(15, 10, 12),
            new Minimap(GameManager.CANVAS_X - 75, 5),
            new PlayerHealth(15, 40)
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

class PlayerHealth extends HUDItem {

    constructor(x, y) {
        super(x, y);
    }

    preload(){
        this.fullHeart = loadImage('../assets/hud/nonaHeartFull.png');
        this.emptyHeart = loadImage("../assets/hud/nonaHeartEmpty.png");
    }

    render() {
        if (!this.character) {
            this.character = gameManager.getByTag(Character.TAG);
        }

        for(let i = 0; i < Character.PLAYER_STARTING_HEALTH; ++i){
            if((i+1) <= this.character.playerHealth)
                image(this.fullHeart, (this.x + 34*i), this.y);
            else
                image(this.emptyHeart, (this.x + 34*i), this.y);
        }
    }
}

class Minimap extends HUDItem {

    constructor(x, y) {
        super(x, y)
    }

    render() {

        this.scale = 7;
        if (!this.map) {
            this.map = createGraphics(LevelLayout.LEVEL_WIDTH * this.scale, LevelLayout.LEVEL_HEIGHT * this.scale);
            
            let halfScale = this.scale / 2;
            this.map.translate((this.map.width / 2) - halfScale, (this.map.height / 2) - halfScale);
        }
        this.map.background(255, 255, 255, 255);
        this.map.fill(0);

        let cell = levelManager.cell;
        this.map.fill(0, 255, 0);
        this.map.square(0, 0, 7);
        this.map.fill(0);

        this.drawCell(cell, Cell.UP, 0, -10);
        this.drawCell(cell, Cell.LEFT, 10, 0);
        this.drawCell(cell, Cell.DOWN, 0, 10);
        this.drawCell(cell, Cell.RIGHT, -10, 0);

        image(this.map, this.x, this.y);
    }

    drawCell(cell, direction, x, y) {
        if (cell.has(direction)) return;

        if (levelManager.layout.getRelative(cell, direction).visited) this.map.fill(255, 0, 0);
        this.map.square(x, y, this.scale);
        this.map.fill(0);
    }

}