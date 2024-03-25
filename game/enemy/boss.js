class Boss extends Enemy {

    static HEALTH_BAR_WIDTH = 500;
    static HEALTH_BAR_HEIGHT = 30;
    static HEALTH_BAR_OFFSET = 692;

    static DIALOG_BOX_WIDTH = 250;
    static DIALOG_BOX_HEIGHT = 75;
    static DIALOG_BOX_OFFSET = 15;

    static REMORA_COUNT = 10;

    static TAG = "LASER_SHARK_BOSS";

    constructor(x, y) {
        super(x, y, 50, spriteManager.get("laserShark"));
        super.collider = true;
        this.tag = Boss.TAG;
        this.showBar = false;
        this.invincible = true;
        this.phase = 0;
        this.maxHealth = 200;
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
            this.moveToTarget(1.75);
            if(p5.Vector.sub(this.target, this.position).mag() <= 1.75) ++this.phase;
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

            ++this.wait;
            if (this.wait >= this.transitionTime) {
                if (this.dialogPhase < 11) {
                    ++this.dialogPhase;
                    this.wait = 0;
                    return;
                }
                ++this.phase;
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
            ++this.wait;

            this.sprite.swapAnimation("charging", false);

            if (this.wait % 10) {
                if (this.health >= this.maxHealth) {
                    this.sprite.callback = () => {
                        this.sprite.swapAnimation("idle", false);
                        ++this.phase;
                        delete this.wait;
                    }
                } else ++this.health;
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
            if (this.movements >= 4) {
                if (!this.wait) {
                    this.wait = 1;
                }
                
                if ((this.wait >= 100) && (this.wait % 10 == 0)) this.shootTarget();

                this.wait++;
                if (this.wait >= 400) {
                    this.wait = 0;
                    this.movements = 0;

                    this.sprite.angle = 0;
                    delete this.wait;
                }
                return;
            }

            if (this.movements % 2 == 0)  this.moveToTarget(6);
            else this.moveToTarget(2);

            if(p5.Vector.sub(this.target, this.position).mag() < 10) {
                this.sprite.swapAnimation("bite", true, () => {
                    this.findTarget();
                    this.movements++;
                });
            }
        }

        if (this.phase == 4) {
            this.moveToTarget(2);
            if(p5.Vector.sub(this.target, this.position).mag() <= 1) {
                ++this.phase;
                this.showBar = false;
            }
        }
        
        // dialog phase 2
        if (this.phase == 5) {
            this.sprite.swapAnimation("charging", false);
            if (!this.dialogPhase) this.dialogPhase = 0;
            if (!this.wait) this.wait = 0;

            if (this.dialogPhase == 0) this.displayDialog("OUCH.", 200);
            if (this.dialogPhase == 1) this.displayDialog("You think this is some kind of game?", 250);
            if (this.dialogPhase == 2) this.displayDialog("ANYWAYS...", 150);
            if (this.dialogPhase == 3) this.displayDialog("I am done playing around.", 150);
            if (this.dialogPhase == 4) this.displayDialog("Let's see how you deal with this!", 150);
            
            this.wait++;
            if (this.wait >= this.transitionTime) {
                if (this.dialogPhase < 4) {
                    ++this.dialogPhase;
                    this.wait = 0;
                    return;
                }

                ++this.phase;

                delete this.wait;
                delete this.dialogPhase;
                delete this.transitionTime;
                delete this.target;
            }
        }

        if (this.phase == 6) {
            if (!this.target) this.target = createVector(GameManager.CANVAS_X + 100, GameManager.CANVAS_Y / 2);
            this.moveToTarget(2);
            this.showBar = true;
            if(p5.Vector.sub(this.target, this.position).mag() <= 2) ++this.phase;
            return; 
        }

        if (this.phase == 7) {
            if(!this.wait) this.wait = 0;
            if (!this.movements) this.movements = 1;
            if (!this.moving) this.moving = 0;

            if (this.moving == 1) {
                this.moveToTarget(5);
                if(p5.Vector.sub(this.target, this.position).mag() <= 11) this.moving = 0;
                return;
            }

            this.wait++;
            if (this.wait >= 150) {
                for(let j = 0; j < Boss.REMORA_COUNT; j++) {
                    let rand = roomManager.room.randomPosition();
                    roomManager.room.spawn(new RemoraFish(rand.x, rand.y));
                }
                this.movements++;   
                this.wait = 0;
            }

            if (this.movements % 3 == 0) {
                let movementOffset = this.movements / 3;
                let positionOffset = ((GameManager.CANVAS_Y / 3) * movementOffset);
                this.moving = 1;
                this.target = new p5.Vector((movementOffset == 2 ?  GameManager.CANVAS_X + 100 : -100), positionOffset);
            }

            if (this.movements >= 9) {
                delete this.wait;
                delete this.movements;
                delete this.target;
                this.phase++;
                return;
            }
            return; 
        }

        if (this.phase == 8) {
            if (!this.target) this.target = createVector(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2);
            this.moveToTarget(2);
            if(p5.Vector.sub(this.target, this.position).mag() <= 2) {
                this.invincible = false;
                ++this.phase;
            }
            return;
        }

        // dash and basic attacks plus occasional remora spawns
        if (this.phase == 9) {
            if (this.health <= 0) {
                roomManager.room.spawn(new Delozier(-100, 0));
                super.destroy();
                return;
            }

            if (!this.movements) this.movements = 0;
            if (this.movements >= 4) {
                if (!this.wait) {
                    this.wait = 1;
                }
                
                if ((this.wait >= 100) && (this.wait % 10 == 0)) this.shootTarget();

                this.wait++;
                
                if (this.wait >= 400) {
                    for(let j = 0; j < Boss.REMORA_COUNT - 5; j++) {
                        let rand = roomManager.room.randomPosition();
                        roomManager.room.spawn(new RemoraFish(rand.x, rand.y));
                    }
                    this.movements++;   
                    this.wait = 0;
                    

                    this.wait = 0;
                    this.movements = 0;

                    this.sprite.angle = 0;
                    delete this.wait;
                    
                }
                return;
            }

            if (this.movements % 2 == 0)  this.moveToTarget(6);
            else this.moveToTarget(2);

            if(p5.Vector.sub(this.target, this.position).mag() < 10) {
                this.sprite.swapAnimation("bite", true, () => {
                    this.findTarget();
                    this.movements++;
                });
            }
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
        if (other instanceof InkProjectile || other instanceof ShotgunProjectile) --this.health;
    }

    destroy() {
        for (let x = 0; x < 100; x++) {
            let rand = roomManager.room.randomPosition();
            roomManager.room.spawn(new Coin(rand.x, rand.y));
        }
        this.showBar = false;
        super.destroy();
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
        //this.sprite.angle = (this.sprite.flipped ? -angleToTarget : angleToTarget + Math.PI);
        this.sprite.angle = (this.sprite.flipped = -angleToTarget);

        // spawn projectile
        gameManager.queue(new LaserProjectile(this.position.x, this.position.y, angleToTarget, this.sprite.flipped));
    }

    incDialogPhase() {
        this.dialogPhase++
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
        --other.health;
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
        angleVector.setMag(10); //speed
        this.position.add(angleVector);
    }
}

class RemoraFish extends Enemy {

    constructor (x, y) { super(x, y, 0, spriteManager.get("remoraFish")); }

    findTarget() {
        super.findTarget();
        this.angle = atan2(this.target.y - this.position.y, this.target.x - this.position.x);
    }

    render () {
        super.render();

        this.sprite.cycleAnimation(); // run animation
        this.sprite.angle = this.angle + (3 * Math.PI / 2);
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (!this.target) this.findTarget();

        let movement = p5.Vector.fromAngle(this.angle);
        if(abs(this.target.x - this.position.x) < 1 && abs(this.target.y - this.position.y) < 1) this.findTarget();

        movement.setMag(2.4); //speed

        this.position.add(movement);
    }
    dropLoot(){
        if(Utils.randomInt(1, 10) % 10 == 1) {
            if(Utils.randomInt(0, 2) % 2 == 1) {
                let speedPotion = new SpeedBoost(this.position.x, this.position.y);
                roomManager.room.spawn(speedPotion);
            } else {
                let healthPotion = new HealthBoost(this.position.x, this.position.y);
                roomManager.room.spawn(healthPotion);

            }
        }
    }

}

class Altar extends GameObject {
    static startBossFight = false;
    constructor(x, y, sprite) { 
        super(x, y, sprite);
        this.priority = GameManager.Priority.LOW;
    }

    render () {
        if(Altar.startBossFight){
            this.destroy();
            roomManager.bossMode();
            let characterReference = gameManager.getByTag(Character.TAG);
            characterReference.position = createVector(GameManager.CANVAS_X/4, GameManager.CANVAS_Y/2);
            characterReference.movementMatrix = [ false, false, false, false ];
        }
        else
            this.sprite.show(this.position.x, this.position.y); // show on screen
    }

    onCollision(other) {
        if (!(other instanceof Character)) return;      
        if(other.coins >= 50){
            menuManager.set("Boss");   
        }    
    }
}

class Delozier extends Enemy {

    static TAG = "THE_MAN";

    constructor (x, y) { 
        super(x, y, 0, spriteManager.get("Delozier"));
        this.tag = "THE_MAN"; 
        this.talking = false;
    }

    // no collision
    onCollision(other) {
        return
    }
    destroy() {}

    render () {
        if (!this.target) this.target = new p5.Vector(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2);

        this.sprite.cycleAnimation(); // run animation
        this.sprite.show(this.position.x, this.position.y); // show on screen

        if (this.talking) {
            if (!this.wait) this.wait = 0;

            this.wait++;
            this.sprite.swapAnimation("bite", false);
            this.displayDialog(`You win! Congrats! You collected ${gameManager.getByTag(Character.TAG).coins} coins.`, 100);
            return;
        }

        let movement = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
        if(abs(this.target.x - this.position.x) < 2.25 && abs(this.target.y - this.position.y) < 2.25) this.talking = true;

        movement.setMag(2.25); //speed
        this.position.add(movement);
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

}
