
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
        this.toLoad = [];
        this.sprites = [];
    }

    get(spriteName) {
        for (let i = 0; i < this.sprites.length; i++) {
            if (this.sprites[i].name === spriteName) return this.sprites[i];
        }
        return null;
    }

    load(spriteName) {
        if (Array.isArray(spriteName)) {
            for (let i = 0; i < spriteName.length; i++) this.toLoad.push(spriteName[i]);
            return;
        }
        
        this.toLoad.push(spriteName);
    }

    preloadAll() {
        this.toLoad.forEach(spriteName => {
            let spriteFile = `../assets/${spriteName}`;
            let sprite = new Sprite(spriteFile);
            sprite.preload();
            
            this.sprites.push(sprite);
        });
        delete this.toLoad;
    }

    loadAll() {
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

        let allAnimations = this.data.animations;
        let allAnimationNames = Object.keys(allAnimations);

        allAnimationNames.forEach(name => {
            let animation = [];
            let frames = allAnimations[name];
            frames.forEach(frame => {
                let position = frame.position;
                let sprite = this.sprites.get(position.x, position.y, position.width, position.height);
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
        rotate(this.angle);
        image(this.animations[this.animation][this.index], -16, -16);
        //rotate(PI / 2);
        pop();
        
    }

    cycleAnimation() {
        //dif (this.animations.length <= 0) return; // do nothing, not animated

        this.delay++;
        if (this.delay <= 5) return; // wait 5 frames per animation 
        
        this.delay = 0;
        this.index++;
        if (this.index >= this.animations[this.animation].length) this.index = 0;
    }

    swapAnimation(name) {
        this.animation = name;
    }

}