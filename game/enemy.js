
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
        this.randomX = Math.floor(Math.random() * GameManager.CANVAS_X);
        this.randomY = Math.floor(Math.random() * GameManager.CANVAS_Y);
    }

    render () {
        this.updatePathing();
        
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        //this.enemyMove(this.position.x);


        let movement = createVector(0, 0);
        if ((this.randomX < this.position.x) && (this.position.x >= 16)) {
            movement.x -= 1;
        }
        if ((this.randomX > this.position.x) && (this.position.y <= GameManager.CANVAS_Y - 16)) {
            movement.y += 1;
        }
        if ((this.randomY < this.position.x) && (this.position.x >= 16)) {
            movement.x -= 1;
        }
        if ((this.randomY > this.position.x) && (this.position.Y <= GameManager.CANVAS_Y - 16)) {
            movement.y += 1;
        }


        movement.setMag(1.5); //speed

        this.position.add(movement);

        if((this.randomX == this.position.x) && (this.randomY == this.position.y)){
            movement.x = 0;
            movement.y = 0;
            //randomX = Math.floor(Math.random() * GameManager.CANVAS_X);
            //randomY = Math.floor(Math.random() * GameManager.CANVAS_Y);
            console.log("hello");
        }
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