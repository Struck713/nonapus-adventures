
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

    render() {
        this.gameObjects.forEach(gameObject => gameObject.render());
    }

}

/**
 * GameController
 * 
 * Manages keyboard events
 * 
 */
class GameController {

    constructor() {
        this.subscribers = [];
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    keyPressed(code) {
        this.subscribers.forEach(subscriberCallback => subscriberCallback.keyPressed(code)); // this is insane that it is possible
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
        this.x = x;
        this.y = y;
        console.log("called gameobject: " + x + ", " + y);
    }

    
    render() {
        // to be overwritten
    }


} 