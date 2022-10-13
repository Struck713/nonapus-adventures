class LevelManager {

    constructor() {
        this.levels = []; // this is just a level template list
        this.tiles = [];
        this.level = 0; // index of current level
    }

    preload(toLoad) {
        this.tilesetImage = loadImage('../assets/levels/tileset.png'); //load tileset
        this.tilesetJSON = loadJSON('../assets/levels/tileset.json');

        toLoad.forEach(index => {
            let level = new Level(index);
            level.preload();

            this.levels.push(level);
        });
    }

    load() {
        let tilesJSON = this.tilesetJSON.tiles;
        tilesJSON.forEach(tileJSON => {
            let tile = this.tilesetImage.get(tileJSON.x, tileJSON.y, tileJSON.width, tileJSON.height);
            console.log([tileJSON.x, tileJSON.y, tileJSON.width, tileJSON.height].join(', '))
            this.tiles.push(tile);
        });

        this.levels.forEach(level => level.load(this.tiles));
        this.levels.forEach(level => console.log(level));

        delete this.tilesetImage;
        delete this.tilesetJSON;
    }

    render() {
        this.levels[this.level].render();
    }

}

class Level {

    constructor(index) {
        this.index = index;
        this.tileMatrix = [];
    }

    preload() {
        this.tileMatrixJSON = loadJSON(`../assets/levels/${this.index}.json`);
    }

    load(tiles) {
        this.tileMatrix = this.tileMatrixJSON.layout;
        delete this.tileMatrixJSON;
    
        //console.log((GameManager.CANVAS_X * GameManager.CANVAS_Y) / (32 * 32));

        this.graphics = createGraphics(GameManager.CANVAS_X, GameManager.CANVAS_Y);
        for (let column = 0; column < (GameManager.CANVAS_Y / 32); ++column) {
            for (let row = 0; row < (GameManager.CANVAS_X / 32); ++row) {
                var tile = tiles[this.tileMatrix[column][row]];
                var offsetX = row * 32;
                var offsetY = column * 32;
                //console.log(`${offsetX}, ${offsetY}: ${this.tileMatrix[column][row]}`)
                this.graphics.image(tile, offsetX, offsetY);
            }
        }

    }

    render() {
        image(this.graphics, 0, 0);
    }

}
