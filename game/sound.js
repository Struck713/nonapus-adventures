class SoundManager {

    constructor() { this.sounds = []; }

    preload(sounds) {
        sounds.forEach(name => {
            let sound = new Sound(name);
            sound.preload();
            this.sounds.push(sound);
        });
    }
    
    play(name) {
        let sound = this.sounds.find(sound => sound.name == name);
        sound.play();
    }
}

class Sound {
    constructor(name) { this.name = name; }
    preload    ()     { this.data = loadSound(`assets/sound/${this.name}.mp3`); }
    play       ()     { this.data.play(); }
}