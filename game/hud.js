class HUDManager {

    constructor() {
        this.hudItems = [
            new Minimap(GameManager.CANVAS_X - 80, 10),
            new Ink(15, 10),
            new Health(15, 45),
            new Coins(15, 80),
            new BossBar()
        ];
    }

    preload() { this.hudItems.forEach(hudItem => hudItem.preload()); }
    render () { this.hudItems.forEach(hudItem => hudItem.render()); }
}

class HUDItem {

    constructor(x, y) { this.x = x; this.y = y; }

    preload() {}
    render () {}

}

class Ink extends HUDItem {

    constructor(x, y) { super(x, y); }

    preload() {
        this.fullInk = loadImage('assets/hud/inkFull.png');
        this.emptyInk = loadImage("assets/hud/inkEmpty.png");
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

    constructor(x, y) { super(x, y); }

    preload(){
        this.fullHeart = loadImage('assets/hud/nonaHeartFull.png');
        this.emptyHeart = loadImage("assets/hud/nonaHeartEmpty.png");
        this.fullTempHeart = loadImage("assets/hud/nonaTempHeartFull.png");
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
        else {
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

    constructor(x, y) { super(x, y); }

    preload() { this.coin = loadImage('assets/hud/wideCoin.png'); }

    render() {

        if (!this.character) this.character = gameManager.getByTag(Character.TAG);

        // fix later
        textAlign(CENTER, CENTER);
        textSize(16);
        fill(0);
        image(this.coin, this.x, this.y);
        text(this.character.coins, this.x + 16, this.y + 15);
    }

}

class Minimap extends HUDItem {

    constructor(x, y) { 
        super(x, y);
    }

    render() {

        this.scale = 7;
        if (!this.map) {
            this.map = createGraphics(10 * this.scale, 10 * this.scale);
            
            let halfScale = this.scale / 2;
            this.map.translate((this.map.width / 2) - halfScale, (this.map.height / 2) - halfScale);
            this.map.background(0, 0, 0, 0);
        }

        image(this.map, this.x, this.y);

        let room = roomManager.room;
        if (room == this.oldRoom) return; // dont draw!

        this.oldRoom = room;

        this.map.clear();
        this.map.noFill();
        this.map.circle(this.scale / 2, this.scale / 2, 10 * this.scale);

        this.map.fill(250, 115, 253);
        this.map.square(0, 0, this.scale);
        this.map.fill(0);

        this.needDrawn = [];
        this.drawCell(room, Room.UP, 0, -10, 1);
        this.drawCell(room, Room.LEFT, 10, 0, 1);
        this.drawCell(room, Room.DOWN, 0, 10, 1);
        this.drawCell(room, Room.RIGHT, -10, 0, 1);

        //console.log(this.needDrawn);
        this.needDrawn.forEach(room => {
            if (room.visited) this.map.fill(72, 188, 253);
            else this.map.fill(0);
            this.map.square(room.offsetX, room.offsetY, this.scale);
        });
    }

    drawCell(room, direction, x, y, adjustment) {
        if (room.walls[direction]) return;
        if (adjustment > 4) return;
        
        let offsetRoom = roomManager.getRelative(room, direction);
        this.needDrawn.push({ offsetX: x, offsetY: y, visited: offsetRoom.visited });

        adjustment += 1;

        if (!offsetRoom.visited) return;
        if (direction != Room.DOWN) this.drawCell(offsetRoom, Room.UP, x, y - 10, adjustment);
        if (direction != Room.RIGHT) this.drawCell(offsetRoom, Room.LEFT, x + 10, y, adjustment);
        if (direction != Room.UP) this.drawCell(offsetRoom, Room.DOWN, x, y + 10, adjustment);
        if (direction != Room.LEFT) this.drawCell(offsetRoom, Room.RIGHT, x - 10, y, adjustment);
    }

}

class BossBar extends HUDItem {

    constructor() { super(0, 0); }

    preload() { this.bossIcon = loadImage('assets/hud/bossIcon.png'); }

    render() {
        if (!this.boss) {
            let boss = gameManager.getByTag(Boss.TAG);
            if (!boss) return;
            this.boss = boss;
        }

        if (!this.boss.showBar) return;

        push();
        image(this.bossIcon, (GameManager.CANVAS_X / 2) - (Boss.HEALTH_BAR_WIDTH / 2) - 36, Boss.HEALTH_BAR_OFFSET);
        //image(this.bossIcon, (((GameManager.CANVAS_X / 2) - (Boss.HEALTH_BAR_WIDTH / 2)) + this.boss.health * (Boss.HEALTH_BAR_WIDTH / this.boss.maxHealth)), Boss.HEALTH_BAR_OFFSET);
        noFill();
        stroke(0);
        rect((GameManager.CANVAS_X / 2) - (Boss.HEALTH_BAR_WIDTH / 2), Boss.HEALTH_BAR_OFFSET, Boss.HEALTH_BAR_WIDTH, Boss.HEALTH_BAR_HEIGHT)
        fill(255, 0, 0);
        noStroke();
        rect((GameManager.CANVAS_X / 2) - (Boss.HEALTH_BAR_WIDTH / 2), Boss.HEALTH_BAR_OFFSET, this.boss.health * (Boss.HEALTH_BAR_WIDTH / this.boss.maxHealth), Boss.HEALTH_BAR_HEIGHT);
        pop();
    }
}