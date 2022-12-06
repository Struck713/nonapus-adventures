// Room generator

class RoomGenerator { 
    generate(room) {}
    spawn(room) {}
}

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


    spawn(room) {

        room.objects = [];
        let mimicChance = random(0, 9);

        let weight = room.weight;
        if (weight >= 10 && weight <= 25) {
            this.multiply(room, Crab, Utils.randomInt(1, 10));
            this.multiply(room, Clam, Utils.randomInt(8, 12));

            
        } else if (weight > 25 && weight <= 30) {
            this.multiply(room, AnglerFish, Utils.randomInt(2, 6));
            this.multiply(room, Clam, Utils.randomInt(8, 12));
        } else if (weight > 30 && weight <= 50) {
            this.multiply(room, Clam, Utils.randomInt(1, 2));
            this.multiply(room, Crab, Utils.randomInt(2, 4));
            this.multiply(room, AnglerFish, Utils.randomInt(0, 1));
            this.multiply(room, Pufferfish, Utils.randomInt(1, 3));
            this.multiply(room, Shark, Utils.randomInt(2, 4));
            this.multiply(room, Coin, Utils.randomInt(0, 5));

            if(mimicChance < 1) {
                this.multiply(room, Chest, 1);
                this.multiply(room, Mimic, 1);
            } else 
                this.multiply(room, Chest, Utils.randomInt(0, 2));

        } else if (weight > 50 && weight <= 65) {
            this.multiply(room, Clam, 3);
            this.multiply(room, Crab, Utils.randomInt(1, 3));
            this.multiply(room, AnglerFish, Utils.randomInt(2, 5));
            this.multiply(room, ElectricEel, Utils.randomInt(2, 4));

            if(mimicChance < 1) {
                this.multiply(room, Chest, Utils.randomInt(1, 2));
                this.multiply(room, Mimic, 1);
            } else 
                this.multiply(room, Chest, Utils.randomInt(0, 3));


        } else if (weight > 65 && weight <= 75) {
            this.multiply(room, Chest, Utils.randomInt(3, 5));
            this.multiply(room, Mimic, Utils.randomInt(0, 2));

        } else if (weight > 75 && weight <= 80) {
            if(mimicChance < 1) {
                room.spawn(new Mimic(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2), false);
            } else 
                room.spawn(new Chest(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2), false);

            let scale = 150;
            for (let i = 0; i < WaveUtils.CIRCLE_12.length; ++i) {
                let adjustmentPosition = WaveUtils.CIRCLE_12[i];
                room.spawn(new Clam((GameManager.CANVAS_X / 2) + (scale * adjustmentPosition.x), (GameManager.CANVAS_Y / 2) + (scale * adjustmentPosition.y)), false);
            }
        } else if (weight > 80 && weight <= 90) {
            this.multiply(room, Clam, 2);
    
            if(mimicChance < 1) {
                room.spawn(new Mimic(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2), false);
            } else 
                room.spawn(new Chest(GameManager.CANVAS_X / 2, GameManager.CANVAS_Y / 2), false);
            
            let scale = 150;
            for (let i = 0; i < WaveUtils.CIRCLE_12.length; ++i) {
                let adjustmentPosition = WaveUtils.CIRCLE_12[i];
                room.spawn(new Coin((GameManager.CANVAS_X / 2) + (scale * adjustmentPosition.x), (GameManager.CANVAS_Y / 2) + (scale * adjustmentPosition.y)), false);
            }
        }

        console.log(`${room.x}, ${room.y}: ${room.objects.length} objects`);
    }

    multiply(room, clazz, amount) {
        for (let i = 0; i < amount; ++i) {
            let rand = room.randomPosition();
            room.spawn(new clazz(rand.x, rand.y), false);
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

    spawn(room) {
        room.spawn(new Boss(GameManager.CANVAS_X + 100, GameManager.CANVAS_Y / 2), true);
    }

}

class RoomGenerators {
    static BASIC = new BasicRoomGenerator();
    static BOSS  = new BossRoomGenerator();
}