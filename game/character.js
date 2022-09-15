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
        if (code == 'a' || code == 'ArrowLeft') {
            super.translate(0, 0);
        }
    }

}