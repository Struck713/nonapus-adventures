
/**
 * SpriteManager
 * 
 * Contains a map of all of the sprites that we have loaded.
 * We can dynamically load a bunch of sprites when the game
 * initializes and then access them at anytime to render to
 * the screen.
 * 
 */
class SpriteManager {

    constructor() {
        this.sprites = [];
    }

    get(spriteName) {

        for (let i = 0; i < this.sprites.length; i++) {
            if (this.sprites[i].name === spriteName) {
                let sprite = this.sprites[i];
                return Utils.deepCopy(sprite);
            }
        }
        return null;
    }

    preload(toLoad) {
        toLoad.forEach(spriteName => {
            let spriteFile = `../assets/sprites/${spriteName}`;
            let sprite = new Sprite(spriteFile);
            sprite.preload();
            
            this.sprites.push(sprite);
        });
        delete this.toLoad;
    }

    load() {
        this.sprites.forEach(sprite => sprite.load());
    }

}

/**
 * Sprite
 * 
 * You can create an animated sprite from a spritesheet and a JSON file
 * of frame data. This class handles all of the logic for that.
 * 
 */
class Sprite {

    constructor(fileName) {
        this.fileName = fileName;

        this.animation = "idle"; // default animation is idle
        this.resetOnFinish = false;
        this.index = 0;
        this.delay = 0;
        this.angle = 0;
        this.animations = [];

        this.loaded = false;
    }

    preload() {
        this.sprites = loadImage(this.fileName); //load spritesheet
        this.data = loadJSON(`${this.fileName}.json`);
    }
    
    load() {
        this.name = this.data.name;
        this.width = this.data.width;
        this.height = this.data.height;

        let allAnimations = this.data.animations;
        let allAnimationNames = Object.keys(allAnimations);

        allAnimationNames.forEach(name => {
            let animation = [];
            let frames = allAnimations[name];
            frames.forEach(frame => {
                let sprite = this.sprites.get(frame.x, frame.y, this.width, this.height);
                animation.push(sprite);
            });
            this.animations[name] = animation;
        })

        this.loaded = true;
        this.frameData = null;
        this.spriteSheet = null; // we dont need the frame data or spritesheet stored in the cache
    }

    show(x, y) {
        push();
        translate(x, y);
        if (this.flipped) scale(-1, 1); // flip over vertical axis
        rotate(this.angle); // rotate against angle

        let frame = this.animations[this.animation][this.index];
        image(frame, -(frame.width / 2), -(frame.height / 2));
        
        //rotate(PI / 2);
        pop();
        
    }

    cycleAnimation() {
        //dif (this.animations.length <= 0) return; // do nothing, not animated

        this.delay++;
        if (this.delay <= 5) return; // wait 5 frames per animation 
        
        this.delay = 0;
        this.index++;
        if (this.index >= this.animations[this.animation].length) {
            if (this.callback) { this.callback(); delete this.callback; }
            if (this.resetOnFinish) this.swapAnimation("idle", false);

            this.index = 0;
        }
    }

    swapAnimation(name, resetOnFinish, callback = (() => {})) {
        if (this.animation == name) return;
        this.index = 0;
        this.animation = name;
        this.resetOnFinish = resetOnFinish;
        this.callback = callback;
    }

}