class PowerUp extends GameObject {

    constructor (x, y, sprite) {
        super(x, y, sprite);
        this.index = 0;
        this.frames = 0;
    }

    calculateAngleToTarget() {
        let character = gameManager.getByTag(Character.TAG);
        this.target = createVector(character.position.x, character.position.y);
        this.angle = atan2(this.target.y - this.position.y, this.target.x - this.position.x);
    }

    updatePathing() {

    }

    render () {
        if (this.index >= WaveUtils.POINTS_25.length) this.index = 0;
        this.sprite.show(this.position.x, this.position.y + (3 * WaveUtils.POINTS_25[this.index])); // show on screen
        if (this.frames >= 5) {
            this.index++;
            this.frames = 0;
        }
        this.frames++;
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

    onCollision(other) {
        if (!(other instanceof Character)) return;
        other.isHealthBoosted = true;
        other.health += Character.HEALTH_BOOST_VALUE;
        if (other.health > 6) other.health = 6;
        this.destroy();
    }
}