class HUDManager {

    constructor() {
        this.hudItems = [
            new Minimap(GameManager.CANVAS_X - 80, 10),
            new Ink(15, 10),
            new Health(15, 45),
            new Coins(15, 80)
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

class Ink extends HUDItem {

    constructor(x, y) {
        super(x, y);
    }

    preload() {
        this.fullInk = loadImage('../assets/hud/ink_full.png');
        this.emptyInk = loadImage("../assets/hud/ink_empty.png");
    }

    render() {
        if (!this.character) this.character = gameManager.getByTag(Character.TAG);

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
        this.fullTempHeart = loadImage("../assets/hud/nonaTempHeartFull.png");
    }

    render() {
        if (!this.character) this.character = gameManager.getByTag(Character.TAG);

        if(this.character.health <= Character.HEALTH_DEFAULT_VALUE)
            this.character.isHealthBoosted = false;

        if(this.character.isHealthBoosted){
            for(let i = 0; i < Character.HEALTH_DEFAULT_VALUE + Character.HEALTH_BOOST_VALUE; ++i){
                if((i+1) <= this.character.health)
                    if (i >= Character.HEALTH_DEFAULT_VALUE) image(this.fullTempHeart, (this.x + 34*i), this.y);
                    else image(this.fullHeart, (this.x + 34*i), this.y);
                else
                    image(this.emptyHeart, (this.x + 34*i), this.y);
            }
        }
        else{
            for(let i = 0; i < Character.HEALTH_DEFAULT_VALUE; ++i){
                if((i+1) <= this.character.health)
                    image(this.fullHeart, (this.x + 34*i), this.y);
                else
                    image(this.emptyHeart, (this.x + 34*i), this.y);
            }
        }
    }
}

class Coins extends HUDItem {

    constructor(x, y) {
        super(x, y);
    }

    preload(){
        this.coin = loadImage('../assets/hud/coin.png');
    }

    render() {

        if (!this.character) this.character = gameManager.getByTag(Character.TAG);

        // fix later
        textAlign(CENTER, CENTER);
        textSize(16);
        fill(0);
        image(this.coin, this.x, this.y);
        text(this.character.coins, this.x + 16, this.y + 18);
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

        this.map.noFill();
        this.map.circle(this.scale / 2, this.scale / 2, 10 * this.scale);

        let room = roomManager.room;
        this.map.fill(0, 255, 0);
        this.map.square(0, 0, this.scale);
        this.map.fill(0);

        this.drawCell(room, Room.UP, 0, -10);
        this.drawCell(room, Room.LEFT, 10, 0);
        this.drawCell(room, Room.DOWN, 0, 10);
        this.drawCell(room, Room.RIGHT, -10, 0);

        image(this.map, this.x, this.y);
    }

    drawCell(cell, direction, x, y) {
        if (cell.walls[direction]) return;

        if (roomManager.getRelative(cell, direction).visited) this.map.fill(255, 0, 0);
        this.map.square(x, y, this.scale);
        this.map.fill(0);
    }

}