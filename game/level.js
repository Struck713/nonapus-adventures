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

    // returns a list of nearby tiles if they are collideable
    isCollideable(x, y) {

        var tile = this.current.getTileByXY(x, y);
        var up = this.current.getTileByRowColumn(tile.row, tile.column - 1);
        var down = this.current.getTileByRowColumn(tile.row, tile.column + 1);
        var left = this.current.getTileByRowColumn(tile.row - 1, tile.column);
        var right = this.current.getTileByRowColumn(tile.row + 1, tile.column);

        return [ 
            up.checkCollisionY(y), 
            down.checkCollisionY(y), 
            left.checkCollisionX(x), 
            right.checkCollisionX(x)
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
        let tileIndexes = this.tileMatrixJSON.layout;
        delete this.tileMatrixJSON;

        this.tileMatrix = [];
        this.graphics = createGraphics(GameManager.CANVAS_X, GameManager.CANVAS_Y);
        for (let column = 0; column < GameManager.COLUMNS; ++column) {
            this.tileMatrix[column] = [];
            for (let row = 0; row < GameManager.ROWS; ++row) {
                var tileIndex = tileIndexes[column][row];
                var tile = tiles[tileIndex];
                var offsetX = row * LevelManager.TILE_SIZE;
                var offsetY = column * LevelManager.TILE_SIZE;

                this.tileMatrix[column][row] = 
                    new Tile(tileIndex,
                        tile.collide,
                        row, 
                        column, 
                        { 
                            x: offsetX + LevelManager.TILE_SIZE_HALF, 
                            y: offsetY + LevelManager.TILE_SIZE_HALF, 
                        }
                    );
                
                this.graphics.image(tile, offsetX, offsetY);
            }
        }
    }

    render() {
        image(this.graphics, 0, 0);
    }

    getTileByXY(x, y) {
        let row = floor(x / LevelManager.TILE_SIZE);
        if (GameManager.ROWS <= row) return null;

        let column = floor(y / LevelManager.TILE_SIZE);
        if (GameManager.COLUMNS <= column) return null;

        return this.getTileByRowColumn(row, column);
    }

    getTileByRowColumn(row, column) {
        return this.tileMatrix[column][row];
    }
}


class Tile {

    constructor(index, collide, row, column, center) {
        this.index = index;
        this.row = row;
        this.collide = collide;
        this.column = column;
        this.center = center;
    }

    checkCollisionX(x) {
        let distanceX = abs(this.center.x - x) - 8;
        return !(distanceX < LevelManager.TILE_SIZE && this.collide);
    }

    checkCollisionY(y) {
        let distanceY = abs(this.center.y - y) - 8;
        return !(distanceY < LevelManager.TILE_SIZE && this.collide);
    }

}