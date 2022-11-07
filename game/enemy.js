
/**
 * Enemy
 * 
 * This class should have code for pathing and collisions. There
 * also will be a method to interact with the player damage handler.
 */
 class Enemy extends GameObject {

    constructor (x, y, sprite) {
        super(x, y, sprite);
        super.collider = true;
    }

    calculateAngleToTarget() {
        let character = gameManager.getByTag(Character.TAG);
        this.target = createVector(character.position.x, character.position.y);
        this.angle = atan2(this.target.y - this.position.y, this.target.x - this.position.x);
    }

    updatePathing() {
        
    }

   /*  render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = p5.Vector.fromAngle(this.angle);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(1); //speed

        this.position.add(movement);
    } */

    // onCollision(other) {
    //     console.log(`${other.sprite.fileName} collied with ${this.sprite.fileName}`);
    // }

}

class Pufferfish extends Enemy {

    constructor (x, y) {
        super(x, y, spriteManager.get("Pufferfish"));
        super.collider = true;
    }

    updatePathing() {
        //movement.setMag(3); // do something!
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = p5.Vector.fromAngle(this.angle);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.5); //speed

        this.position.add(movement);
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        this.sprite.swapAnimation("explode", () => this.destroy(), false);
    }

}

class Shark extends Enemy{
    constructor (x, y) {
        super(x, y, spriteManager.get("Shark"));
        super.collider = true;
    }

    updatePathing() {
        //movement.setMag(3); // do something!
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
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
        super(x, y, spriteManager.get("Urchin"));
        super.collider = true;
    }

    updatePathing() {
        //movement.setMag(3); // do something!
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = p5.Vector.fromAngle(this.angle);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.2); //speed

        this.position.add(movement);
    }

}

class Clam extends Enemy{
    constructor (x, y) {
        super(x, y, spriteManager.get("Clam"));
        super.collider = true;
    }

    updatePathing() {
        //movement.setMag(3); // do something!
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = p5.Vector.fromAngle(this.angle);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.3); //speed

        this.position.add(movement);
    }

}

class Crab extends Enemy{
    constructor (x, y) {
        super(x, y, spriteManager.get("Crab"));
        super.collider = true;
    }

    updatePathing() {
        //movement.setMag(3); // do something!
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.calculateAngleToTarget();

        let movement = p5.Vector.fromAngle(this.angle);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        movement.setMag(.45); //speed

        this.position.add(movement);
    }

}

