class TileManager {

    static Types = {
        ALL_TILES: -1, 
        SAND: 0,
        BORDER_SAND: 1,
        METAL: 2,
        BORDER_METAL: 3,
        RIGHT_LASER: 4,
        LEFT_LASER: 5,
        BOTTOM_LASER: 6,
        TOP_LASER: 7
    }

    static ROWS = GameManager.CANVAS_X / 32;
    static COLUMNS = GameManager.CANVAS_Y / 32;
    static TILE_SIZE = 32;
    static TILE_SIZE_HALF = RoomManager.TILE_SIZE / 2;

    constructor() {
        this.tiles = [];
    }

    preload() {
        this.tilesetImage = loadImage('../assets/levels/tileset.png'); //load tileset
        this.tilesetJSON = loadJSON('../assets/levels/tileset.json');
    }

    load() {
        let tilesJSON = this.tilesetJSON.tiles;
        let index = 0;
        tilesJSON.forEach(tileJSON => {
            let position = tileJSON.position;
            let tile = this.tilesetImage.get(position.x, position.y, position.width, position.height);
            tile.index = index;
            tile.properties = {
                collide: tileJSON.collide,
                rarity: tileJSON.rarity,
                type: tileJSON.type
            };
            this.tiles.push(tile);

            index++;
        });

        delete this.tilesetImage;
        delete this.tilesetJSON;
    }

    getTilesByType(type) {
        if (type === TileManager.Types.ALL_TILES) return this.tiles;
        return this.tiles.filter(tile => tile.properties.type == type);
    }

    getTileByRarity(rarity) {
        let tilesOfRarity = this.tiles.filter(tile => tile.properties.rarity >= rarity);
        return random(tilesOfRarity);
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