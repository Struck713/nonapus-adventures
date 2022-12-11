
/**
 * GameManager
 * 
 * Manages all game functionality, in the future
 * we will mostly use it to deal with changing scenes. 
 * 
 */
class GameManager {

    static Priority = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3
    }

    static DEBUG = false;
    static CANVAS_X = 960;
    static CANVAS_Y = 736;

    constructor() { 
        this.gameObjects = []; 
        this.changed = false;
    }

    render() {
        // render

        if (this.changed) {
            let sorted = this.gameObjects.sort((a, b) => (a.priority - b.priority));
            this.gameObjects = sorted;
            this.changed = false;
        }

        this.gameObjects.forEach(gameObject => {
            
            if (gameObject.collider) this.gameObjects.forEach(other => gameObject.checkCollisions(other)); // check collisions
            if (!gameObject.isRenderable()) gameObject.destroy(); // check if still on screen (object cleanup)

            // draw hitboxes
            if (GameManager.DEBUG) this.drawHitbox(gameObject);
            gameObject.render();
        });
    }

    queue(gameObject)   { 
        this.gameObjects.push(gameObject);
        this.changed = true;
    }

    dequeue(gameObject) { 
        Utils.remove(this.gameObjects, gameObject); 
        this.changed = true;
    } 
    
    reset() { 
        this.gameObjects = [];
        character = new Character(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2);
        this.queue(character);
    }

    getByClass(clazz)   { return this.gameObjects.filter(gameObject => gameObject instanceof clazz);}

    getByTag(tag) {
        return this.gameObjects.find(gameObject => {
            if (!gameObject.hasOwnProperty("tag")) return false;
            if (gameObject.tag !== tag) return false;
            return true;
        })
    }

    getById(id) {
        if (this.gameObjects.length <= id) return null;
        return this.gameObjects[id];
    }

    drawHitbox(gameObject) {
        push();
        translate(gameObject.position.x - (gameObject.sprite.width / 2) + gameObject.sprite.min.x, gameObject.position.y - (gameObject.sprite.height / 2) + gameObject.sprite.min.y);
        //rectMode(CENTER);
        noFill();
        rect(0, 0, gameObject.sprite.max.x, gameObject.sprite.max.y);
        pop();
    }

}

/*
 * GameObject
 * 
 * This class should be inherited by anything that is going to be
 * rendered to the screen. That includes playable characters, enemies
 * and anything else. 
 */

class GameObject {

    constructor (x, y, sprite) {
        this.position = new p5.Vector(x, y);
        this.collider = false;
        this.priority = GameManager.Priority.LOW;

        this.sprite = sprite;
        if (!this.sprite.loaded) this.sprite.load();
    }

    render() {} // to be overwritten

    destroy() {
        gameManager.dequeue(this);
        delete this;
    }

    checkCollisions(other) {
        if (other === this) return;

        let axesToTest = [new p5.Vector(0, 1), new p5.Vector(1, 0)];
        for (let i = 0; i < axesToTest.length; ++i) {
            if (!this.checkAxis(other, axesToTest[i])) return false;
        }

        other.onCollision(this);
        this.onCollision(other);
    }

    onCollision(other) {} // upon colliding

    isRenderable() {
        if (this.tag) return true;
        let x = this.position.x;
        let y = this.position.y;
        return (x > 0 && y > 0 && x < GameManager.CANVAS_X && y < GameManager.CANVAS_Y);
    }

    checkAxis(other, axis) {
        let interval1 = this.getProjection(axis);
        let interval2 = other.getProjection(axis);
        return ((interval2.x <= interval1.y) && (interval1.x <= interval2.y));
    }

    getProjection(axis) {
        let result = new p5.Vector(0, 0);
        let corner = new p5.Vector(this.position.x - (this.sprite.width / 2), this.position.y - (this.sprite.height / 2));
        let min = new p5.Vector(corner.x + this.sprite.min.x, corner.y + this.sprite.min.y);
        let max = new p5.Vector(corner.x + this.sprite.max.x, corner.y + this.sprite.max.y);

        let vertex = [
            new p5.Vector(min.x, min.y), new p5.Vector(min.x, max.y),
            new p5.Vector(max.x, min.y), new p5.Vector(max.x, max.y)
        ];

        result.x = axis.dot(vertex[0]);
        result.y = result.x;

        for (let i = 0; i < vertex.length; i++) {
            let projection = axis.dot(vertex[i]);
            if (projection < result.x) result.x = projection;
            if (projection > result.y) result.y = projection;
        }

        return result;
    }

}

class Projectile extends GameObject { 
    
    constructor(x, y, sprite) { 
        super(x, y, sprite)
        super.priority = GameManager.Priority.HIGH;
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
        if(other.coins >= 40){
            menuManager.set("Boss");   
        }    
    }
}