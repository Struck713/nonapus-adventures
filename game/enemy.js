
/**
 * Enemy
 * 
 * This class should have code for pathing and collisions. There
 * also will be a method to interact with the player damage handler.
 */
 class Enemy extends GameObject {

    static random() {
        let list = [ Pufferfish, Shark, Urchin, Clam, Crab ];
        return random(list);
    }

    constructor (x, y, health, sprite) {
        super(x, y, sprite);
        this.health = health;
    }

    calculateAngleToTarget() {
        let character = gameManager.getByTag(Character.TAG);
        this.target = createVector(character.position.x, character.position.y);
    }

    onCollision(other) {
        if (other instanceof OilAttack) {
            if (this.health <= 0) this.destroy();
            this.health--;
        }
    }

    destroy() {
        this.health = 0;
        super.destroy();
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
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.5); //speed
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
        this.angle = atan2(this.target.y - this.position.y, this.target.x - this.position.x)
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.angle = this.angle + (3 * Math.PI / 2);
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = p5.Vector.fromAngle(this.angle);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(1); //speed

        this.position.add(movement);
    }

}

class Urchin extends Enemy{
    constructor (x, y) {
        super(x, y, 10, spriteManager.get("Urchin"));
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.2); //speed
        this.position.add(movement);
    }

}

class Clam extends Enemy{
    constructor (x, y) {
        super(x, y, 6, spriteManager.get("Clam"));
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.3); //speed
        this.position.add(movement);
    }

}

class Crab extends Enemy {

    constructor (x, y) {
        super(x, y, 3, spriteManager.get("Crab"));
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.45); //speed
        this.position.add(movement);
    }

}