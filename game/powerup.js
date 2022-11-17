class PowerUp extends GameObject {

    constructor (x, y, sprite) {
        super(x, y, sprite);
    }

    calculateAngleToTarget() {
        let character = gameManager.getByTag(Character.TAG);
        this.target = createVector(character.position.x, character.position.y);
        this.angle = atan2(this.target.y - this.position.y, this.target.x - this.position.x);
    }

    updatePathing() {

    }

    render () {
      
    }

    destroy() {
        gameManager.dequeue(this);
        delete this;
    }

    onCollision(other) {
        
    }

}

class SpeedBoost extends PowerUp {
    constructor (x, y) {
        super(x, y, spriteManager.get("SpeedBoost"));
    }

    updatePathing() {

    }

    render () {
        // this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        //if (!this.target) this.calculateAngleToTarget();

        // let movement = p5.Vector.fromAngle(this.angle);
        // if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        // movement.setMag(.5); //speed

        // this.position.add(movement);
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        other.isSpeedBoosted = true;
        other.boostTime = 500;
        this.destroy();
    }
}

class HealthBoost extends PowerUp {
    constructor (x, y) {
        super(x, y, spriteManager.get("HealthBoost"));
    }

    updatePathing() {

    }

    render () {
        // this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        //if (!this.target) this.calculateAngleToTarget();

        // let movement = p5.Vector.fromAngle(this.angle);
        // if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.calculateAngleToTarget();

        // movement.setMag(.5); //speed

        // this.position.add(movement);
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        other.isHealthBoosted = true;
        other.health = Character.HEALTH_DEFAULT_VALUE + Character.HEALTH_BOOST_VALUE;
        this.destroy();
    }
}