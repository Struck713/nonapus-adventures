/**
 * Character
 * 
 * This is the main character class, it contains character controller
 * logic, along with a movement matrix and a collision matrix.
 */
class Character extends GameObject {

    constructor (x, y, sprite, crosshair) {
        super(x, y);
        super.collider = true;
        this.movementMatrix = [ false, false, false, false ];

        this.sprite = sprite;
        if (!this.sprite.loaded) this.sprite.load();

        this.mousePosition = createVector(0, 0);
        this.crosshair = crosshair;
        if (!this.crosshair.loaded) this.crosshair.load();
    }

    render () {
        this.sprite.cycleAnimation(); // run animation

        
        //let targetAngle = atan2(this.mousePosition.y, this.mousePosition.x);
        //translate(this.position.x, this.position.y);
        //rotate(PI/2);
        
        this.sprite.show(this.position.x, this.position.y); // show on screen
        this.sprite.angle = atan2(this.mousePosition.y - this.position.y, this.mousePosition.x - this.position.x);

        this.crosshair.show(this.mousePosition.x - 16, this.mousePosition.y - 16); // centers
        let movement = createVector(0, 0);
        // if ((this.movementMatrix[0]) && (this.position.y >= 3)) {
        //     movement.y -= 1;
        // }
        // if ((this.movementMatrix[1]) && (this.position.y <= gameCanvasSizey-35)) {
        //     movement.y += 1;
        // }
        // if ((this.movementMatrix[2]) && (this.position.x >= 3)) {
        //     movement.x -= 1;
        // }
        // if ((this.movementMatrix[3]) && (this.position.x <= gameCanvasSizex-35)) {
        //     movement.x += 1;
        // }
        if ((this.movementMatrix[0]) && (this.position.y >= 16)) {
            movement.y -= 1;
        }
        if ((this.movementMatrix[1]) && (this.position.y <= gameCanvasSizey - 16)) {
            movement.y += 1;
        }
        if ((this.movementMatrix[2]) && (this.position.x >= 16)) {
            movement.x -= 1;
        }
        if ((this.movementMatrix[3]) && (this.position.x <= gameCanvasSizex - 16)) {
            movement.x += 1;
        }

        movement.setMag(2.5); //speed

        this.position.add(movement);
    }

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
   
    /*
    *
    * tracking mouse pos on canvas
    *
    */
   trackMouse(x, y){
        this.mousePosition.x = x;
        this.mousePosition.y = y;
    }


}

/**
 * Enemy
 * 
 * This class should have code for pathing and collisions. There
 * also will be a method to interact with the player damage handler.
 */
class Enemy extends GameObject {

    constructor (x, y, sprite) {
        super(x, y);
        this.sprite = sprite;

        if (!this.sprite.loaded) this.sprite.load();
    }

    render () {
        // pathing updates
        
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen
    }

    onCollision(other) {
        console.log(`${other.sprite.fileName} collied with ${this.sprite.fileName}`);
    }

} 
