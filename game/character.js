/**
 * Character
 * 
 * This is the main character class, it contains character controller
 * logic, along with a movement matrix and a collision matrix.
 */
class Character extends GameObject {

    static TAG = "CHARACTER";

    constructor (x, y) {
        super(x, y, spriteManager.get("Nona"));
        super.collider = true;
        this.tag = Character.TAG;
        this.mousePosition = createVector(0, 0);
        this.movementMatrix = [ false, false, false, false ];
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        
        this.sprite.show(this.position.x, this.position.y); // show on screen
        this.sprite.angle = atan2(this.mousePosition.y - this.position.y + 8, this.mousePosition.x - this.position.x + 8) - (PI/2); // we add 8 to center the nona and cursor and subtract PI/2  

        let movement = createVector(0, 0);
        if ((this.movementMatrix[0]) && (this.position.y >= 16)) {
            movement.y -= 1;
        }
        if ((this.movementMatrix[1]) && (this.position.y <= GameManager.CANVAS_Y - 16)) {
            movement.y += 1;
        }
        if ((this.movementMatrix[2]) && (this.position.x >= 16)) {
            movement.x -= 1;
        }
        if ((this.movementMatrix[3]) && (this.position.x <= GameManager.CANVAS_X - 16)) {
            movement.x += 1;
        }

        movement.setMag(2.5); //speed

        this.position.add(movement);
    }

    onCollision(other) {
        if (!(other instanceof Enemy)) return;
        console.log('nona collided with enemy!');
    }

    fireParticle() {
        gameManager.queue(new OilAttack(this.position.x, this.position.y, this.sprite.angle));
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
        super(x, y, spriteManager.get("OilAttack"));
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