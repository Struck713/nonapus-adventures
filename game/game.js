
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

    constructor() {
        this.gameObjects = [];
    }

    queue(gameObject) {
        this.gameObjects.push(gameObject);
    }

    checkCollisions() {
        this.gameObjects.forEach(gameObject => {
            if (!gameObject.collider) return;
            this.gameObjects.forEach(other => gameObject.checkCollisions(other));
        });
    }

    render() {
        this.checkCollisions();
        this.gameObjects.forEach(gameObject => gameObject.render());
    }

}

/**
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

    render() {
        // to be overwritten
    }

    checkCollisions(other) {
        if (other === this) return;

        let distanceVector = p5.Vector.sub(this.position, other.position);
        let distanceMag = distanceVector.mag();

        if (distanceMag <= 16) {
           other.onCollision(this);
        }
    }

    onCollision(other) {
        // upon colliding
    }


} 