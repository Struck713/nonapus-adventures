
/**
 * GameManager
 * 
 * Manages all game functionality, in the future
 * we will mostly use it to deal with changing scenes. 
 * 
 */
class GameManager {

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
 * GameController
 * 
 * Manages keyboard events by subscribing classes to it.
 */
class GameController {

    constructor() {
        this.subscribers = [];
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    keyPressed(code, pressed) {
        this.subscribers.forEach(subscriberCallback => subscriberCallback.keyPressed(code, pressed)); // this is insane that it is possible
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

    constructor (x, y) {
        this.position = new p5.Vector(x, y);
        this.collider = false;
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