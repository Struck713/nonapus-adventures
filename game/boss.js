class Boss extends GameObject {

    static HEALTH_BAR_WIDTH = 500;
    static HEALTH_BAR_HEIGHT = 30;
    static HEALTH_BAR_OFFSET = 15;

    static TAG = "LASER_SHARK_BOSS"

    constructor(x, y) {
        super(x, y, spriteManager.get("laserShark"));
        this.tag = Boss.TAG;
        this.maxHealth = 250;
        this.health = this.maxHealth;
        this.showBar = false;
        this.phase = 0;
        this.stage = 0;
    }

    calculateAngleToTarget() {
        let character = gameManager.getByTag(Character.TAG);
        this.target = createVector(character.position.x, character.position.y);
        this.sprite.flipped = this.target.x - this.position.x >= 0;
    }

    render() {
        //this.calculateAngleToTarget();

        if (!this.target) this.target = createVector(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2);

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (this.showBar) this.displayHealthBar();

        if (this.phase == 0) {
            let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
            movement.setMag(1);
            this.position.add(movement);

            if(p5.Vector.sub(this.target, this.position).mag() <= 0) {
                this.phase++;
                this.showBar = true;
            }
        }

        if (this.phase == 1) {

            let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
            if (this.stage == 3) movement.setMag(5);
            else movement.setMag(1);
            
            this.position.add(movement);

            if(p5.Vector.sub(this.target, this.position).mag() < 5) {
                this.calculateAngleToTarget();

                if (this.stage >= 3) {
                    this.stage = 1;
                    return;
                }

                this.stage++;
            }
        }

    }

    onCollision(other) {
        if (other instanceof InkProjectile) --this.health;
    }

    displayHealthBar() {
        noFill();
        stroke(0);
        rect((GameManager.CANVAS_X / 2) - (Boss.HEALTH_BAR_WIDTH / 2), Boss.HEALTH_BAR_OFFSET, Boss.HEALTH_BAR_WIDTH, Boss.HEALTH_BAR_HEIGHT)
        fill(255, 0, 0);
        noStroke();
        rect((GameManager.CANVAS_X / 2) - (Boss.HEALTH_BAR_WIDTH / 2), Boss.HEALTH_BAR_OFFSET, this.health * (Boss.HEALTH_BAR_WIDTH / this.maxHealth), Boss.HEALTH_BAR_HEIGHT);
    }

}