class HUDManager {

    constructor() {
        this.hudItems = [
            new Minimap(GameManager.CANVAS_X - 75, 5),
            new Ink(15, 10),
            new Health(15, 40)
        ];
    }

    preload() {
        this.hudItems.forEach(hudItem => hudItem.preload());
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

    preload() {

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

// class Ink extends HUDItem {

//     constructor(x, y) {
//         super(x, y);
//     }

//     render() {
    
//         if (!this.character) {
//             this.character = gameManager.getByTag(Character.TAG);
//         }

//         fill(0);
//         rect(this.x, this.y, 100, 25)
//         fill(161, 33, 240);
//         rect(this.x, this.y, this.character.inkLeft * (100 / Character.INK_DEFAULT_VALUE), 25);
//     }

// }

class Ink extends HUDItem {

    constructor(x, y) {
        super(x, y);
    }

    preload() {
        this.fullInk = loadImage('../assets/hud/ink_full.png');
        this.emptyInk = loadImage("../assets/hud/ink_empty.png");
    }

    render() {
        if (!this.character) {
            this.character = gameManager.getByTag(Character.TAG);
        }

        for(let i = 0; i < Character.INK_DEFAULT_VALUE; ++i){
            if((i+1) <= this.character.ink)
                image(this.fullInk, (this.x + 34*i), this.y);
            else
                image(this.emptyInk, (this.x + 34*i), this.y);
        }
    }
}

class Health extends HUDItem {

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

        for(let i = 0; i < Character.HEALTH_DEFAULT_VALUE; ++i){
            if((i+1) <= this.character.health)
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
            this.map = createGraphics(10 * this.scale, 10 * this.scale);
            
            let halfScale = this.scale / 2;
            this.map.translate((this.map.width / 2) - halfScale, (this.map.height / 2) - halfScale);
            this.map.background(0, 0, 0, 0);
        }
        this.map.fill(255);
        this.map.circle(this.scale / 2, this.scale / 2, 10 * this.scale);

        let level = levelManager.level;
        this.map.fill(0, 255, 0);
        this.map.square(0, 0, this.scale);
        this.map.fill(0);

        this.drawCell(level, Level.UP, 0, -10);
        this.drawCell(level, Level.LEFT, 10, 0);
        this.drawCell(level, Level.DOWN, 0, 10);
        this.drawCell(level, Level.RIGHT, -10, 0);

        image(this.map, this.x, this.y);
    }

    drawCell(cell, direction, x, y) {
        if (cell.has(direction)) return;

        if (levelManager.getRelative(cell, direction).visited) this.map.fill(255, 0, 0);
        this.map.square(x, y, this.scale);
        this.map.fill(0);
    }

}