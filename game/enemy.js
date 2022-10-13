
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

    render () {
        this.updatePathing();
        
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen
    }

    updatePathing() {

    }

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
        // do something!
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        this.sprite.swapAnimation("explode");
    }

}