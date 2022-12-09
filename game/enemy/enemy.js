
/**
 * Enemy
 * 
 * This class should have code for pathing and collisions. There
 * also will be a method to interact with the player damage handler.
 */
 class Enemy extends GameObject {

    static HEALTH_BAR_OFFSET = 25;
    static HEALTH_BAR_WIDTH = 20;
    static HEALTH_BAR_HEIGHT = 5;

    static random(x, y) {
        let enemies = [ Pufferfish, Shark, Urchin, Clam, Crab, AnglerFish, ElectricEel, Mimic ];
        let enemy = random(enemies);
        return new enemy(x, y);
    }

    constructor (x, y, health, sprite) {
        super(x, y, sprite);
        super.priority = GameManager.Priority.HIGH;
        this.maxHealth = health;
        this.health = this.maxHealth;
        this.displayHealth = false;
    }

    findTarget() {
        let character = gameManager.getByTag(Character.TAG);
        this.target = createVector(character.position.x, character.position.y);
    }

    render() {
        if (this.displayHealth) {
            noFill();
            rect(this.position.x - (Enemy.HEALTH_BAR_WIDTH / 2), this.position.y - Enemy.HEALTH_BAR_OFFSET, Enemy.HEALTH_BAR_WIDTH, Enemy.HEALTH_BAR_HEIGHT)
            fill(161, 33, 240);
            rect(this.position.x - (Enemy.HEALTH_BAR_WIDTH / 2), this.position.y - Enemy.HEALTH_BAR_OFFSET, this.health * (Enemy.HEALTH_BAR_WIDTH / this.maxHealth), Enemy.HEALTH_BAR_HEIGHT);
        }
    }

    onCollision(other) {
        if (other instanceof InkProjectile) {
            if (this.dead) this.destroy();
            --this.health;
            this.displayHealth = true;
        } else 
        if (other instanceof ShotgunProjectile) {
            if (this.dead) this.destroy();
            --this.health;
            this.displayHealth = true;
        }
    }

    destroy() {
        this.health = 0;
        this.dropLoot();
        super.destroy();
    }

    dropLoot() {
        for (let amount = 0; amount < random(0, 3); amount++) {
            let coin = new Coin(this.position.x, this.position.y);
            coin.position.x += (amount * coin.sprite.width);
            roomManager.room.spawn(coin);
        }
    }

    get dead() { return (this.health <= 0); }
}

class Pufferfish extends Enemy {

    constructor (x, y) { super(x, y, 5, spriteManager.get("Pufferfish")); }

    findTarget() {
        super.findTarget();
        this.sprite.flipped = this.target.x - this.position.x >= 0;
    }

    render () {
        super.render();

        if (!this.target) this.findTarget();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.findTarget();

        movement.setMag(1); //speed
        this.position.add(movement);
    }

    onCollision(other) {
        super.onCollision(other);
        if (other instanceof Character) this.sprite.swapAnimation("explode", false, () => this.destroy());
    }

}

class Shark extends Enemy {

    constructor (x, y) { super(x, y, 2, spriteManager.get("Shark")); }

    findTarget() {
        super.findTarget();
        this.angle = atan2(this.target.y - this.position.y, this.target.x - this.position.x);
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.angle = this.angle + (3 * Math.PI / 2);
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.findTarget();

        let movement = p5.Vector.fromAngle(this.angle);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.findTarget();

        movement.setMag(1.15); //speed

        this.position.add(movement);
    }

    dropLoot(){
        if(Utils.randomInt(1, 3) % 2 == 0) {
            let speedPotion = new SpeedBoost(this.position.x, this.position.y);
            roomManager.room.spawn(speedPotion);
        } else {
            for (let amount = 0; amount < random(0, 2); amount++) {
                let coin = new Coin(this.position.x, this.position.y);
                coin.position.x += (amount * coin.sprite.width);
                roomManager.room.spawn(coin);
            }
        }
    }

}

class Urchin extends Enemy {
    constructor (x, y, child=false) { 
        super(x, y, 10, spriteManager.get("Urchin"));
        this.child = child;
    }

    onCollision(other) {
        super.onCollision(other);
        if (this.child) return; // children cannot replicate

        // replicate
        if (this.health <= (this.maxHealth / 2)) {
            if (random(0, 100) <= 25) {
                let randX = random(-this.sprite.width, this.sprite.width);
                let randY = random(-this.sprite.height, this.sprite.height);
                let clone = new Urchin(this.position.x + randX, this.position.y + randY, true);
                roomManager.room.spawn(clone);
            }
        }
    }

    render () {
        super.render();

        if (!this.target) this.findTarget();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.findTarget();

        movement.setMag(.9); //speed
        this.position.add(movement);
    }

}

class Clam extends Enemy {

    static DEFAULT_TARGETTING_TIME = 150;
    static DEFAULT_COOLDOWN_TIME = 100;

    constructor (x, y) { 
        super(x, y, 6, spriteManager.get("Clam"));
        this.targetting = false;
        this.targettingTime = Clam.DEFAULT_TARGETTING_TIME;
        this.cooldownTime = Clam.DEFAULT_COOLDOWN_TIME;
    }

    onCollision(other) {
        if (!this.targetting) return;
        super.onCollision(other);
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.targetting) {
            if (this.cooldownTime >= 0) {
                this.cooldownTime--;
                return;
            }

            this.findTarget();
            let targetVector = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
            if (targetVector.mag() <= 100) {
                this.sprite.swapAnimation("attack", false);
                this.targetting = true;
            }
            return;
        }

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.findTarget();

        movement.setMag(2); //speed
        this.position.add(movement);
        
        this.targettingTime--;
        if (this.targettingTime <= 0) {
            this.targetting = false;
            this.cooldownTime = Clam.DEFAULT_COOLDOWN_TIME;
            this.targettingTime = Clam.DEFAULT_TARGETTING_TIME;
            this.sprite.swapAnimation("idle", false);
            this.displayHealth = false;
        }
    }

    dropLoot(){
        if(Utils.randomInt(1, 3) % 2 == 0) {
            let healthPotion = new HealthBoost(this.position.x, this.position.y);
            roomManager.room.spawn(healthPotion);
        } else {
            for (let amount = 0; amount < random(0, 2); amount++) {
                let coin = new Coin(this.position.x, this.position.y);
                coin.position.x += (amount * coin.sprite.width);
                roomManager.room.spawn(coin);
            }
        }
    }

}


class Mimic extends Enemy {
    

    constructor (x, y) { 
        super(x, y, 15, spriteManager.get("Mimic"));
        this.targetting = false;
    }

    onCollision(other) {
        if (!this.targetting) return;
        super.onCollision(other);
    }

    dropLoot() {
        let coinAmount = random(15, 20);
        let healthAmount = Utils.randomInt(0, 2);
        let inkAmount = Utils.randomInt(0, 2);

        let scale = 100;
        let allAmount = coinAmount + healthAmount + inkAmount;
        let circle = WaveUtils.pointsAlongCircle(allAmount);

        for (let x = 0; x < allAmount; x++) {
            let healthAdjustment = x - coinAmount;
            let inkAdjustment = healthAdjustment - healthAmount;

            let object = new Coin(0, 0);
            if (healthAdjustment > 0 && healthAdjustment <= healthAmount) object = new HealthUpgrade(0, 0);
            else if (inkAdjustment > 0 && inkAdjustment <= inkAmount) object = new InkUpgrade(0, 0);

            let adjustmentPosition = circle[x];
            object.position = new p5.Vector(this.position.x + (scale * adjustmentPosition.x), this.position.y + (scale * adjustmentPosition.y));
            roomManager.room.spawn(object);

        }
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen
    

        if (!this.targetting) {
            if (this.cooldownTime >= 0) {
                this.cooldownTime--;
                return;
            }

            this.findTarget();
            let targetVector = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
            if (targetVector.mag() <= 100) {
                this.sprite.swapAnimation("attack", false);
                this.targetting = true;
            }
            return;
        }

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 2.3 && abs(this.target.y - this.position.y) < 2.3) this.findTarget();
        this.sprite.flipped = this.target.x - this.position.x >= 0;
    
        movement.setMag(2); //speed
        
        movement.setMag(2.3);
        this.position.add(movement);
        
    }
    findTarget() {
        super.findTarget();
        //this.sprite.flipped = this.target.x - this.position.x >= 0;
    }
}


class Crab extends Enemy {

    constructor (x, y) { 
        super(x, y, 3, spriteManager.get("Crab"));
        this.vertical = true;
    }

    findTarget() {
        super.findTarget();
        this.vertical = true;
    }

    // the crab will never move on a diagonal
    render () {
        super.render();

        if (!this.target) this.findTarget();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen
    
        // avi rathod loves the ternary operator
        let movement = createVector((this.vertical ? 0 : this.target.x - this.position.x), (this.vertical ? this.target.y - this.position.y : 0));
        if(abs(this.target.y - this.position.y) < 1) this.vertical = false;
        if(abs(this.target.x - this.position.x) < 1) this.findTarget();

        movement.setMag(.97); //speed
        this.position.add(movement);
    }
    dropLoot() {
        let coinAmount = random(0, 3);
        let healthAmount = Utils.randomInt(0, 1);
        let speedAmount = Utils.randomInt(0, 1);

        let scale = 50;
        let allAmount = coinAmount + healthAmount + speedAmount;
        let circle = WaveUtils.pointsAlongCircle(allAmount);

        for (let x = 0; x < allAmount; x++) {
            let healthAdjustment = x - coinAmount;
            let speedAdjustment = healthAdjustment - healthAmount;

            let object = new Coin(0, 0);
            if (healthAdjustment > 0 && healthAdjustment <= healthAmount) object = new HealthBoost(0, 0);
            else if (speedAdjustment > 0 && speedAdjustment <= speedAmount) object = new SpeedBoost(0, 0);

            let adjustmentPosition = circle[x];
            object.position = new p5.Vector(this.position.x + (scale * adjustmentPosition.x), this.position.y + (scale * adjustmentPosition.y));
            roomManager.room.spawn(object);

        }
    }

}

class AnglerFish extends Enemy {

    constructor (x, y) { super(x, y, 2, spriteManager.get("AnglerFish")); }

    findTarget() {
        super.findTarget();
        this.sprite.flipped = this.target.x - this.position.x >= 0;
    }

    render () {
        super.render();

        if (!this.target) this.findTarget();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 2.25 && abs(this.target.y - this.position.y) < 2.25) this.findTarget();

        movement.setMag(2.25); //speed
        this.position.add(movement);
    }

}

class ElectricEel extends Enemy {

    static WAIT = 100;

    constructor (x, y) { 
        super(x, y, 2, spriteManager.get("electricEel"));
        this.wait = ElectricEel.WAIT;
    }

    findTarget() {
        super.findTarget();
        this.angle = atan2(this.target.y - this.position.y, this.target.x - this.position.x) + (3 * Math.PI / 2);
    }

    findRandomTarget() {
        this.target = roomManager.room.randomPosition();
        this.sprite.flipped = this.target.x - this.position.x >= 0;
    }

    render () {
        super.render();

        if (!this.target) this.findRandomTarget();

        this.wait--;
        if (this.wait <= 0) {
            this.sprite.swapAnimation("attack", true, () => {
                this.findTarget();
                gameManager.queue(new BoltProjectile(this.position.x, this.position.y, this.angle));
                this.findRandomTarget();
                this.wait = ElectricEel.WAIT;
            });
        }

        this.sprite.cycleAnimation();
        this.sprite.show(this.position.x, this.position.y); // show on screen

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.findTarget();

        movement.setMag(.25); //speed
        this.position.add(movement);
    }

}

class BoltProjectile extends Projectile {

    constructor (x, y, direction) {
        super(x, y, spriteManager.get("BoltProjectile"));
        super.collider = true;
        this.direction = direction;
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        this.destroy();
    }

    render() {
        this.sprite.show(this.position.x, this.position.y);

        let angleVector = p5.Vector.fromAngle(this.direction + (PI / 2));
        angleVector.setMag(3.5); //speed
        this.position.add(angleVector);
    }

}
