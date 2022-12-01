
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
        let enemies = [ Pufferfish, Shark, Urchin, Clam, Crab, AnglerFish, ElectricEel ];
        let enemy = random(enemies);
        return new enemy(x, y);
    }

    constructor (x, y, health, sprite) {
        super(x, y, sprite);
        this.health = health;
        this.maxHealth = health;
        this.displayHealth = false;
    }

    calculateAngleToTarget() {
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
            this.health--;
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

    get dead() {
        return (this.health <= 0);
    }

}

class Pufferfish extends Enemy {

    constructor (x, y) {
        super(x, y, 5, spriteManager.get("Pufferfish"));
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(1); //speed
        this.position.add(movement);
    }

    onCollision(other) {
        super.onCollision(other);
        if (other instanceof Character) this.sprite.swapAnimation("explode", () => this.destroy(), false);
    }

}

class Shark extends Enemy {

    constructor (x, y) {
        super(x, y, 2, spriteManager.get("Shark"));
    }

    calculateAngleToTarget() {
        super.calculateAngleToTarget();
        this.angle = atan2(this.target.y - this.position.y, this.target.x - this.position.x);
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.angle = this.angle + (3 * Math.PI / 2);
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = p5.Vector.fromAngle(this.angle);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(1.5); //speed

        this.position.add(movement);
    }

}

class Urchin extends Enemy{
    constructor (x, y) {
        super(x, y, 10, spriteManager.get("Urchin"));
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.9); //speed
        this.position.add(movement);
    }

}

class Clam extends Enemy{
    constructor (x, y) {
        super(x, y, 6, spriteManager.get("Clam"));
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.85); //speed
        this.position.add(movement);
    }

}

class Crab extends Enemy {

    constructor (x, y) {
        super(x, y, 3, spriteManager.get("Crab"));
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.95); //speed
        this.position.add(movement);
    }

}

class AnglerFish extends Enemy {

    constructor (x, y) {
        super(x, y, 2, spriteManager.get("AnglerFish"));
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(2); //speed
        this.position.add(movement);
    }

}

class ElectricEel extends Enemy {

    constructor (x, y) {
        super(x, y, 2, spriteManager.get("AnglerFish"));
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(2); //speed
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
        if (!(other instanceof Enemy)) return;
        this.destroy();
    }

    render() {
        this.sprite.show(this.position.x, this.position.y);

        let angleVector = p5.Vector.fromAngle(this.direction + (PI / 2));
        angleVector.setMag(3.5); //speed
        this.position.add(angleVector);
    }

}