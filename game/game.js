
/**
 * GameManager
 * 
 * Manages all game functionality, in the future
 * we will mostly use it to deal with changing scenes. 
 * 
 */
class GameManager {

    static CANVAS_X = 960;
    static CANVAS_Y = 736;

    constructor() { this.gameObjects = []; }

    render() {
        // render
        this.gameObjects.forEach(gameObject => {
            
            // check collisions
            if (gameObject.collider) this.gameObjects.forEach(other => gameObject.checkCollisions(other));

            // check if still on screen (object cleanup)
            if (!gameObject.isRenderable()) gameObject.destroy();
            gameObject.render()
        });
    }

    queue(gameObject)   { this.gameObjects.push(gameObject); }

    dequeue(gameObject) { Utils.remove(this.gameObjects, gameObject); } 

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

        let diff = p5.Vector.sub(this.position, other.position);
        let diffDistance = diff.mag();

        if (diffDistance <= (this.sprite.width / 2) && diffDistance <= (this.sprite.height / 2)) {
            other.onCollision(this);
            this.onCollision(other);
        }
    }

    onCollision(other) {} // upon colliding

    isRenderable() {
        if (this.tag) return true;
        let x = this.position.x;
        let y = this.position.y;
        return (x > 0 && y > 0 && x < GameManager.CANVAS_X && y < GameManager.CANVAS_Y);
    }
}

class Projectile extends GameObject { constructor(x, y, sprite) { super(x, y, sprite) } }