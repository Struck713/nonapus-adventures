class Collectable extends GameObject {

    static random(x, y) {
        let collectables = [ SpeedBoost, HealthBoost, Coin, Chest ];
        let rand = random(collectables);
        return new rand(x, y);
    }

    constructor (x, y, sprite) {
        super(x, y, sprite);
        this.index = 0;
        this.frames = 0;
        this.dead = false;
    }

    render () {
        if (this.index >= WaveUtils.POINTS_25.length) this.index = 0;
        
        this.sprite.cycleAnimation();
        this.sprite.show(this.position.x, this.position.y + (3 * WaveUtils.POINTS_25[this.index])); // show on screen
        
        if (this.frames >= 5) {
            this.index++;
            this.frames = 0;
        }
        this.frames++;
    }

    destroy() {
        this.dead = true;
        gameManager.dequeue(this);
        delete this;
    }

    onCollision(other) {}

}

class SpeedBoost extends Collectable {
    constructor (x, y) {
        super(x, y, spriteManager.get("SpeedBoost"));
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        other.isSpeedBoosted = true;
        other.boostTime = 500;
        this.destroy();
    }
}

class HealthBoost extends Collectable {

    constructor (x, y) {
        super(x, y, spriteManager.get("HealthPotion"));
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        other.isHealthBoosted = true;
        other.health += Character.HEALTH_BOOST_VALUE;
        if (other.health > 6) other.health = 6;
        this.destroy();
    }
}

class Coin extends Collectable {

    static COIN_DROP_SCALAR = 50;

    constructor(x, y) {
        super(x, y, spriteManager.get("Coin"));
        this.spawnAnimation = 0;
    }

    render() {
        super.render();

        let direction = random([-1, 1]);
        if (this.spawnAnimation <= Coin.COIN_DROP_SCALAR) {
            let offset = -Coin.COIN_DROP_SCALAR * cos(Math.PI * (this.spawnAnimation / Coin.COIN_DROP_SCALAR));

            let movement = createVector(direction * this.spawnAnimation, offset);
            movement.setMag(1);

            this.position.add(movement);
            this.spawnAnimation++;
        }
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        other.coins++;
        this.destroy();
    }

}

class Chest extends Collectable {

    constructor(x, y) {
        super(x, y, spriteManager.get("Chest"));
        this.opened = false;
    }

    render() {
        this.sprite.cycleAnimation();
        this.sprite.show(this.position.x, this.position.y);
    }

    dropLoot() {
        for (let amount = 0; amount < random(0, 3); amount++) {
            let coin = new Coin(this.position.x, this.position.y);
            coin.position.x += (amount * coin.sprite.width);
            roomManager.room.spawn(coin);
        }
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        if (this.opened) return;
        this.sprite.swapAnimation("opening", false, () => {
            this.sprite.swapAnimation("opened", false);
            this.opened = true;
            this.dropLoot();
        });
    }

}