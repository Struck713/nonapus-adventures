
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
        this.index = 0;
        this.delay = 0;
        this.angle = 0;
        this.animation = [];
        this.loaded = false;
    }

    preload() {
        this.spriteSheet = loadImage(this.fileName); //load spritesheet
        this.frameData = loadJSON(`${this.fileName}.json`);
    }
    
    load() {
        this.name = this.frameData.name;
        let frames = this.frameData.frames;
        for (let i = 0; i < frames.length; i++) {
            let position = frames[i].position;
            let sprite = this.spriteSheet.get(position.x, position.y, position.width, position.height);
            this.animation.push(sprite);
        }

        this.loaded = true;
        this.frameData = null;
        this.spriteSheet = null; // we dont need the frame data or spritesheet stored in the cache
    }

    show(x, y) {
        push();
        translate(x, y);
        rotate(this.angle);
        image(this.animation[this.index], 0, 0);
        //rotate(PI / 2);
        pop();
        
    }

    cycleAnimation() {
        if (this.animation.length <= 1) return; // do nothing, not animated

        this.delay++;
        if (this.delay <= 5) return; // wait 5 frames per animation 
        
        this.delay = 0;
        this.index++;
        if (this.index >= this.animation.length) this.index = 0;
    }

}