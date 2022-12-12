class Collectable extends GameObject {

    static random(x, y) {
        let collectables = [ SpeedBoost, HealthBoost, Coin, Chest ];
        let rand = random(collectables);
        return new rand(x, y);
    }

    constructor (x, y, sprite) {
        super(x, y, sprite);
        super.priority = GameManager.Priority.LOW;
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
        ++other.speedItems;
        this.destroy();
    }

    static useSpeedItem(other){
        other.isSpeedBoosted = true;
        other.boostTime = 500;
        soundManager.play(`upgrade_${Utils.randomInt(1, 2)}`);
    }
}

class HealthBoost extends Collectable {

    constructor (x, y) {
        super(x, y, spriteManager.get("HealthPotion"));
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        if(other.healthItems < Character.HEALTH_POTION_MAX)
            ++other.healthItems;
        this.destroy();
    }

    static useHealthItem(other){
        other.isHealthBoosted = true;
        if (other.health >= other.maxHealth) other.health = other.maxHealth;
        else other.health += 2;
        --other.healthItems;
        soundManager.play(`upgrade_${Utils.randomInt(1, 2)}`);
    }
}

class HealthUpgrade extends Collectable {
    constructor (x, y) {
        super(x, y, spriteManager.get("healthUpgrade"));
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        if(other.maxHealth < Character.HEALTH_MAX_VALUE) {
            ++other.maxHealth;
            other.health = other.maxHealth;
        }
        this.destroy();
    }

}

class InkUpgrade extends Collectable {
    constructor (x, y) {
        super(x, y, spriteManager.get("inkUpgrade"));
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        if(other.maxInk < Character.INK_MAX_VALUE) {
            ++other.maxInk;
            other.ink = other.maxInk;
        }
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
        if (this.spawnAnimation <= Coin.COIN_DROP_SCALAR) return;
        ++other.coins;
        this.destroy();
    }

}

class Chest extends Collectable {

    constructor(x, y) {
        super(x, y, spriteManager.get("Chest"));
        this.priority = GameManager.Priority.LOW;
        this.opened = false;
    }

    render() {
        this.sprite.cycleAnimation();
        this.sprite.show(this.position.x, this.position.y);
    }

    dropLoot() {

        soundManager.play("chest_open");

        let coinAmount = Utils.randomInt(0, 5);

        let healthAmount = Utils.randomInt(0, 3);
        let speedAmount = Utils.randomInt(0, 2);

        let healthUpgradeAmount = 0;
        let inkUpgradeAmount = 0;
        let upgradeCheck = Utils.randomInt(0, 4);

        healthUpgradeAmount = Utils.randomInt(0, 2);
        inkUpgradeAmount = Utils.randomInt(0, 2);

        let allAmount = (coinAmount + healthAmount + speedAmount + inkUpgradeAmount + healthUpgradeAmount);

        let scale = 100;
        let circle = WaveUtils.pointsAlongCircle(allAmount);

        let object;

        let coinAdjustment = allAmount - (healthAmount + speedAmount + inkUpgradeAmount + healthUpgradeAmount);
        let healthAdjustment = allAmount - (speedAmount + inkUpgradeAmount + healthUpgradeAmount);
        let speedAdjustment = allAmount - (inkUpgradeAmount + healthUpgradeAmount);
        let healthUpgradeAdjustment = allAmount - (healthUpgradeAmount);
        let inkUpgradeAdjustment = allAmount;

        for (let i = 0; i < allAmount; i++) {
            if (0 <= i && i < coinAdjustment) {
                object = new Coin(0, 0);
            }
            else if (coinAdjustment <= i && i < healthAdjustment) {
                object = new HealthBoost(0, 0);
            }
            else if (healthAdjustment <= i && i < speedAdjustment) {
                object = new SpeedBoost(0, 0);
            }
            else if (speedAdjustment <= i && i < healthUpgradeAdjustment && upgradeCheck > 2) {
                object = new HealthUpgrade(0, 0);
            }
            else if (healthUpgradeAdjustment <= i && i < inkUpgradeAdjustment && upgradeCheck > 2) {
                object = new InkUpgrade(0, 0);
            }

            let adjustmentPosition = circle[i];
            if (!object) continue;
            object.position = new p5.Vector(this.position.x + (scale * adjustmentPosition.x), this.position.y + (scale * adjustmentPosition.y));
            roomManager.room.spawn(object);
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