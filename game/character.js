class Character extends GameObject {

    constructor (x, y, sprite) {
        super(x, y);
        super.collider = true;
        this.sprite = sprite;
        this.movementMatrix = [ false, false, false, false ];

        if (!this.sprite.loaded) this.sprite.load();
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        let movement = createVector(0, 0);
        if (this.movementMatrix[0]) {
            movement.y -= 1;
        }
        if (this.movementMatrix[1]) {
            movement.y += 1;
        }
        if (this.movementMatrix[2]) {
            movement.x -= 1;
        }
        if (this.movementMatrix[3]) {
            movement.x += 1;
        }

        movement.setMag(2); //speed

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

}

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