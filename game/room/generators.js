// Room generator

class RoomGenerator { generate() {} }

class BasicRoomGenerator extends RoomGenerator {

    generate(room) {
        let check = (bound1, max1, bound2, max2, doorIndex) => (bound1 >= (max1 / 2 - 3) && bound1 <= (max1 / 2 + 3)) && (bound2 == max2) && !room.walls[doorIndex];

        room.tiles = [];
        for (let column = 0; column < TileManager.COLUMNS; ++column) {
            room.tiles[column] = [];
            for (let row = 0; row < TileManager.ROWS; ++row) {
                
                // m, j is column
                // n, i is rows

                let rarity = floor(noise(row * .05, column * .05) * 100);
                let sand = tileManager.getTilesByType(TileManager.Types.SAND);

                let tileType = random(sand.filter(tile => (tile.properties.rarity >= rarity)));
                if (!tileType) tileType = sand[0]; // default tiles

                if(row == 0 || column == 0 || row == TileManager.ROWS-1 || column == TileManager.COLUMNS-1) {
                    if (!(check(row, TileManager.ROWS - 1, column, 0, Room.UP) 
                        || check(row, TileManager.ROWS - 1, column, TileManager.COLUMNS - 1, Room.DOWN)
                        || check(column, TileManager.COLUMNS - 1, row, 0, Room.RIGHT)
                        || check(column, TileManager.COLUMNS - 1, row, TileManager.ROWS - 1, Room.LEFT))) {
                        tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_SAND));
                    }
                }
                room.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
            }
        }

        let roundingAmount = random(3, 7);
        let left = roundingAmount;
        let right = TileManager.ROWS - roundingAmount;
        
        for(let column = 1; column < TileManager.COLUMNS; ++column) {
            let row = 1;
        
            if(column < TileManager.COLUMNS - 3) {
                while(row < left) {
                    let tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_SAND));
                    room.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
                    ++row;
                }
        
                if(left > 0) --left;
        
                while(row < TileManager.ROWS - 1) {
                    if(row > TileManager.ROWS / 2 + 3 && row >= right) {
                        let tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_SAND));
                        room.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
                    }
                    ++row;
                }
                ++right;
            }
        }
        
        left = random(3, 7);
        right = TileManager.ROWS - roundingAmount;
        
        for(let column = TileManager.COLUMNS - 1; column > 1; --column) {
            let row = 1;
        
            if(column > TileManager.COLUMNS / 2 + 3) {
                while(row <= left) {
                    let tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_SAND));
                    room.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
                    ++row;
                }

                if(left > 0) --left;
        
                while(row < TileManager.ROWS - 1) {
                    if(row > TileManager.ROWS / 2 + 3 && row >= right) {
                        let tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_SAND));
                        room.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
                    }
                    ++row;
                }
                ++right;
            }
        }
    }

}

class BossRoomGenerator extends RoomGenerator {

    generate(room) {
        room.tiles = [];
        for (let column = 0; column < TileManager.COLUMNS; ++column) {
            room.tiles[column] = [];
            for (let row = 0; row < TileManager.ROWS; ++row) {
                
                // m, j is column
                // n, i is rows

                let rarity = floor(noise(row * .05, column * .05) * 100);
                let metal = tileManager.getTilesByType(TileManager.Types.METAL);

                let tileType = random(metal.filter(tile => (tile.properties.rarity >= rarity)));
                if (!tileType) tileType = metal[0]; // default tiles

                if(row == 0 || column == 0 || row == TileManager.ROWS-1 || column == TileManager.COLUMNS-1) {
                    // if (!(check(row, TileManager.ROWS - 1, column, 0, Room.UP)
                    tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_METAL));
                }
                room.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
            }
        }
    }
}

class RoomGenerators {
    static BASIC = new BasicRoomGenerator();
    static BOSS  = new BossRoomGenerator();
}