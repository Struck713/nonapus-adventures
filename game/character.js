/**
 * Character
 * 
 * This is the main character class, it contains character controller
 * logic, along with a movement matrix and a collision matrix.
 */
class Character extends GameObject {

    static INK_DEFAULT_VALUE = 4; // how many shots
    static INK_INCREASE_SECONDS = 1000; // how many milliseconds to increate

    static HEALTH_DEFAULT_VALUE = 4; // player health starting amount

    static TAG = "CHARACTER";

    constructor (x, y) {

        // set super tags
        super(x, y, spriteManager.get("NonaR"));
        super.collider = true;

        // set game object tags
        this.tag = Character.TAG;

        // player health
        this.health = Character.HEALTH_DEFAULT_VALUE;
        this.tookDamage = false;
        this.damageCoolDown = 0;

        // character specific traits
        this.mousePosition = createVector(0, 0);
        this.movementMatrix = [ false, false, false, false ];

        this.ink = Character.INK_DEFAULT_VALUE;
        setInterval(() => { if (this.ink < Character.INK_DEFAULT_VALUE) this.ink++ }, Character.INK_INCREASE_SECONDS);
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        
        this.sprite.show(this.position.x, this.position.y); // show on screen
        this.sprite.angle = atan2(this.mousePosition.y - this.position.y + 8, this.mousePosition.x - this.position.x + 8) - (PI/2); // we add 16 to center the nona and cursor and subtract PI/2  

        let movement = createVector(0, 0);
        let collisionMatrix = levelManager.isCollideable(this.position.x + 8, this.position.y + 8);
        if ((this.movementMatrix[0]) && (collisionMatrix[0])) {
            movement.y -= 1;
        }
        if ((this.movementMatrix[1]) && (collisionMatrix[1])) {
            movement.y += 1;
        }
        if ((this.movementMatrix[2]) && (collisionMatrix[2])) {
            movement.x -= 1;
        }
        if ((this.movementMatrix[3]) && (collisionMatrix[3])) {
            movement.x += 1;
        }

        if(this.tookDamage) this.loseHealth();
        if(this.damageCoolDown > 0) --this.damageCoolDown;

        movement.setMag(2.5); //speed

        this.position.add(movement);
    }

    onCollision(other) {
        if (!(other instanceof Enemy)) return;
    }

    fireParticle() {
        if (this.ink <= 0) return;
        this.ink--;

        gameManager.queue(new OilAttack(this.position.x, this.position.y, this.sprite.angle));
    }

    loseHealth() {
        if(this.damageCoolDown <= 0){
            --this.playerHealth;
            this.damageCoolDown = 120;
        }
        else
            --this.damageCoolDown;
        console.log(this.playerHealth);
        this.tookDamage = false;
    }

    // event stuff
    keyPressed(code, pressed) {
        switch (code.toUpperCase()) {
            case 'W':
            case 'ARROWUP':
                this.movementMatrix[0] = pressed;
                break;
            case 'S':
            case 'ARROWDOWN':
                this.movementMatrix[1] = pressed;
                break;
            case 'A':
            case 'ARROWLEFT':
                this.movementMatrix[2] = pressed;
                break;
            case 'D':
            case 'ARROWRIGHT':
                this.movementMatrix[3] = pressed;
                break;
            case 'R':
                this.tookDamage = true;
                break;
            default:
                break;
        }
    }
   
    mouseMovement(x, y) {
        this.mousePosition.x = x;
        this.mousePosition.y = y;
    }

    mouseClicked(type) {
        switch (type) {
            case 0:
                this.fireParticle();
            case 1:
                // middle click
            case 2:
                // right click
        }
    }

}

class OilAttack extends GameObject {

    constructor (x, y, direction) {
        super(x, y, spriteManager.get("Clam"));
        super.collider = true;
        this.direction = direction;
    }

    onCollision(other) {

    }

    render() {
        this.sprite.show(this.position.x, this.position.y);

        let angleVector = p5.Vector.fromAngle(this.direction + (PI / 2));
        angleVector.setMag(3.5); //speed
        this.position.add(angleVector);
    }
    
}
