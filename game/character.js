class Character extends GameObject {

    constructor (x, y, sprite) {
        super(x, y);
        this.sprite = sprite;

        if (!this.sprite.loaded) this.sprite.load();
    }

    render () {
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.x, this.y); // show on screen
    }

    keyPressed(code) {
        switch (code.toUpperCase()) {
            case 'W':
                this.y -= 8;
                break;
            case 'S':
                this.y += 8;
                break;
            case 'A':
                this.x -= 8;
                break;
            case 'D':
                this.x += 8;
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
        this.doUpdate();
        
        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.x, this.y); // show on screen
    }

    doUpdate() {

    }

} 