class Boss extends Enemy {

    static HEALTH_BAR_WIDTH = 500;
    static HEALTH_BAR_HEIGHT = 30;
    static HEALTH_BAR_OFFSET = 15;

    static DIALOG_BOX_WIDTH = 250;
    static DIALOG_BOX_HEIGHT = 75;
    static DIALOG_BOX_OFFSET = 15;

    static TAG = "LASER_SHARK_BOSS"

    constructor(x, y) {
        super(x, y, 50, spriteManager.get("laserShark"));
        super.collider = true;
        this.tag = Boss.TAG;
        this.showBar = false;
        this.invincible = true;
        this.phase = 3;
    }

    findTarget() {
        let character = gameManager.getByTag(Character.TAG);
        this.target = createVector(character.position.x, character.position.y);
        this.sprite.flipped = this.target.x - this.position.x >= 0;
    }

    render() {
        if (!this.target) this.target = createVector(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2);

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        // roll out phase
        if (this.phase == 0) {
            this.moveToTarget(1);
            if(p5.Vector.sub(this.target, this.position).mag() <= 1) this.phase++;
        }


        // dialog phase
        if (this.phase == 1) {
            if (!this.dialogPhase) this.dialogPhase = 0;
            if (!this.wait) this.wait = 0;
            if (this.dialogPhase == 0) this.displayDialog("Hello, Nona. I have been expecting you.", 200);
            if (this.dialogPhase == 1) this.displayDialog("I've actually been expecting you for a long... long... time.", 250);
            if (this.dialogPhase == 2) this.displayDialog("If you actually believe you can defeat the great...", 150);
            if (this.dialogPhase == 3) this.displayDialog("and powerful..", 75);
            if (this.dialogPhase == 4) this.displayDialog("LASER SHARK", 150);
            if (this.dialogPhase == 5) this.displayDialog("Then you are even a bigger fool than I thought you were.", 200);
            if (this.dialogPhase == 6) this.displayDialog("Still up for the challenge?", 200);
            if (this.dialogPhase == 7) this.displayDialog("You know I shoot lasers... right?", 300);
            if (this.dialogPhase == 8) this.displayDialog("Fine.", 50);
            if (this.dialogPhase == 9) this.displayDialog("Be that way.", 100);
            if (this.dialogPhase == 10) this.displayDialog(" ", 200);
            if (this.dialogPhase == 11) this.displayDialog("Jerk.", 100);
            this.wait++;
            if (this.wait >= this.transitionTime) {
                if (this.dialogPhase < 11) {
                    this.dialogPhase++;
                    this.wait = 0;
                    return;
                }

                this.phase++;
                this.showBar = true;
                this.health = 0;
                this.invincible = false;

                delete this.wait;
                delete this.dialogPhase;
                delete this.transitionTime;
            }
        }      

        // charge up phase
        if (this.phase == 2) {
            if (!this.wait) this.wait = 0;
            this.wait++;

            this.sprite.swapAnimation("charging", false);

            if (this.wait % 10) {
                if (this.health >= this.maxHealth) {
                    this.sprite.callback = () => {
                        this.sprite.swapAnimation("idle", false);
                        this.phase++;
                        delete this.wait;
                    }
                } else this.health++;
            }
        }

        // dash and basic attacks
        if (this.phase == 3) {
            if (this.health <= (this.maxHealth / 2)) {
                this.target = createVector(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2);
                this.invincible = true;
                this.phase++;

                delete this.wait;
                delete this.movements;
                return;
            }

            if (!this.movements) this.movements = 0;
            if (this.movements >= 9) {
                if (!this.wait) {
                    this.wait = 1;
                    this.invincible = true;
                }
                
                if ((this.wait >= 200) && (this.wait % 10 == 0)) this.shootTarget();

                this.wait++;
                if (this.wait >= 400) {
                    this.wait = 0;
                    this.movements = 0;
                    this.invincible = false;

                    this.sprite.angle = 0;
                    delete this.wait;
                }

                return;
            }

            if (this.movements % 3 == 0)  this.moveToTarget(5);
            else this.moveToTarget(1);

            if(p5.Vector.sub(this.target, this.position).mag() < 5) {
                this.sprite.swapAnimation("bite", true, () => {
                    this.findTarget();
                    this.movements++;
                });
            }
        }

        if (this.phase == 4) {
            this.moveToTarget(1);
            if(p5.Vector.sub(this.target, this.position).mag() <= 1) this.phase++;
        }
        
        // dialog phase 2
        if (this.phase == 5) {
            this.sprite.swapAnimation("charging", false);
            console.log(this.phase);
            if (!this.dialogPhase) this.dialogPhase = 0;
            if (!this.wait) this.wait = 0;

            if (this.dialogPhase == 0) this.displayDialog("OUCH.", 200);
            if (this.dialogPhase == 1) this.displayDialog("You think this is some kind of game?", 250);
            if (this.dialogPhase == 2) this.displayDialog("Well.. it is a game.", 50);
            if (this.dialogPhase == 3) this.displayDialog("ANYWAYS...", 150);
            if (this.dialogPhase == 4) this.displayDialog("I am done playing around.", 150);
            
            this.wait++;
            if (this.wait >= this.transitionTime) {
                if (this.dialogPhase < 4) {
                    this.dialogPhase++;
                    this.wait = 0;
                    return;
                }

                this.phase++;
                this.invincible = false;

                delete this.wait;
                delete this.dialogPhase;
                delete this.transitionTime;
            }
        }

        if (this.phase == 6) {
            return;
        }

        // testing
        // if (this.phase == 3) {
        //     this.moveToTarget(5);
            
        //     if(p5.Vector.sub(this.target, this.position).mag() <= 0) this.phase++;
        // }

        // if (this.phase == 4) {
        //     if (!this.wait) this.wait = 0;
        //     this.wait++;
        // }

    }

    onCollision(other) {
        if (this.invincible) return;
        if (other instanceof InkProjectile) --this.health;
        console.log(this.sprite.width);
        console.log(this.sprite.height);
    }

    displayDialog(dialog, transitionTime) {
        this.transitionTime = transitionTime;

        let characters = Array.from(dialog);
        let percentage = ceil(characters.length * (this.wait / (this.transitionTime / 2)));
        if (percentage >= characters.length) percentage = characters.length;
        let printedText = characters.slice(0, percentage).join("");

        push();
        fill(255);
        rect((GameManager.CANVAS_X / 2) - (Boss.DIALOG_BOX_WIDTH / 2), GameManager.CANVAS_Y - Boss.DIALOG_BOX_HEIGHT - Boss.DIALOG_BOX_OFFSET, Boss.DIALOG_BOX_WIDTH, Boss.DIALOG_BOX_HEIGHT);
        fill(0);
        textAlign(CENTER, CENTER);
        rectMode(CENTER);
        text(printedText, (GameManager.CANVAS_X / 2), GameManager.CANVAS_Y  - (Boss.DIALOG_BOX_HEIGHT / 2) - Boss.DIALOG_BOX_OFFSET, Boss.DIALOG_BOX_WIDTH, Boss.DIALOG_BOX_HEIGHT);
        pop();
    }

    moveToTarget(speed) {
        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        movement.setMag(speed);
        this.position.add(movement);
    }

    shootTarget() {
        this.findTarget();

        // angle math
        let angleToTarget = atan2(this.target.y - this.position.y, this.target.x - this.position.x);
        this.sprite.angle = (this.sprite.flipped ? -angleToTarget : angleToTarget + Math.PI);

        // spawn projectile
        gameManager.queue(new LaserProjectile(this.position.x, this.position.y, angleToTarget, this.sprite.flipped));
    }

}

class LaserProjectile extends Projectile {

    constructor (x, y, direction, flipped) {
        super(x, y, spriteManager.get("laserProjectile"));
        super.collider = true;
        this.direction = direction;
        this.flipped = flipped;
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;
        this.destroy();
    }

    render() {
        this.sprite.cycleAnimation();

        push();
        translate(this.position.x, this.position.y);
        rotate(this.direction);
        this.sprite.flipped = !this.flipped;
        this.sprite.show(50, (this.flipped ? -16 : 16));
        pop();

        let angleVector = p5.Vector.fromAngle(this.direction);
        angleVector.setMag(5); //speed
        this.position.add(angleVector);
    }
    
}
