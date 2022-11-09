class TileManager {

    static ROWS = GameManager.CANVAS_X / 32;
    static COLUMNS = GameManager.CANVAS_Y / 32;
    static TILE_SIZE = 32;
    static TILE_SIZE_HALF = LevelManager.TILE_SIZE / 2;

    constructor() {
        this.tiles = [];
    }

    preload() {
        this.tilesetImage = loadImage('../assets/levels/tileset.png'); //load tileset
        this.tilesetJSON = loadJSON('../assets/levels/tileset.json');
    }

    load() {
        let tilesJSON = this.tilesetJSON.tiles;
        tilesJSON.forEach(tileJSON => {
            let tile = this.tilesetImage.get(tileJSON.x, tileJSON.y, tileJSON.width, tileJSON.height);
            tile.collide = tileJSON.collide;
            this.tiles.push(tile);
        });

        delete this.tilesetImage;
        delete this.tilesetJSON;
    }

}

class Tile {

    constructor(type, collide, row, column) {
        this.type = type;
        this.collide = collide;
        this.row = row;
        this.column = column;
    }

    // checkCollisionX(x) {
    //     let distanceX = abs(this.center.x - x) - 8;
    //     return !(distanceX < LevelManager.TILE_SIZE && this.collide);
    // }

    // checkCollisionY(y) {
    //     let distanceY = abs(this.center.y - y) - 8;
    //     return !(distanceY < LevelManager.TILE_SIZE && this.collide);
    // }

}

class TileUtil {

    static PLAIN_SAND = [0, 6];
    static BORDER_SAND = [11];
    static FILL_SAND = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    static ALL_TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

}