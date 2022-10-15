class LevelManager {

    static TILE_SIZE = 32;
    static TILE_SIZE_HALF = LevelManager.TILE_SIZE / 2;

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
            tile.collide = tileJSON.collide;
            this.tiles.push(tile);
        });

        this.levels.forEach(level => level.load(this.tiles));

        delete this.tilesetImage;
        delete this.tilesetJSON;
    }

    render() {
        this.current.render();
    }

    getTile(x, y, offsetRow, offsetColumn) {
        return this.tiles[this.current.getTile(x, y, offsetRow, offsetColumn)];
    }

    // returns a list of nearby tiles if they are collideable
    isCollideable(x, y) {
        return [
            !this.getTile(x, y, 0, -1).collide, 
            !this.getTile(x, y, 0, 1).collide, 
            !this.getTile(x, y, -1, 0).collide,
            !this.getTile(x, y, 1, 0).collide
        ];
    }

    get current() {
        return this.levels[this.level];
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

        console.log(this.tileMatrix);

        this.graphics = createGraphics(GameManager.CANVAS_X, GameManager.CANVAS_Y);
        for (let column = 0; column < GameManager.COLUMNS; ++column) {
            for (let row = 0; row < GameManager.ROWS; ++row) {
                var tile = tiles[this.tileMatrix[column][row]];
                var offsetX = row * LevelManager.TILE_SIZE;
                var offsetY = column * LevelManager.TILE_SIZE;
                this.graphics.image(tile, offsetX, offsetY);
            }
        }

    }

    render() {
        image(this.graphics, 0, 0);
    }

    getTile(x, y, offsetRow, offsetColumn) {
        let row = floor(x / LevelManager.TILE_SIZE) + offsetRow;
        if (GameManager.ROWS <= row) return null;

        let column = floor(y / LevelManager.TILE_SIZE ) + offsetColumn;
        if (GameManager.COLUMNS <= column) return null;

        return this.tileMatrix[column][row];
    }

}
