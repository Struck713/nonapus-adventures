class RoomManager {

    static ROWS = 5;
    static COLUMNS = 5;

    constructor() {
        this.rooms = [];
        for (let y = 0; y < RoomManager.COLUMNS; y++) {
            this.rooms[y] = [];
            for (let x = 0; x < RoomManager.ROWS; x++) {
                this.rooms[y][x] = new Room(x, y);
            }
        }
    }

    load() {
        this.generate(); // generate the wall sequence

         //generate individual room layout
        this.rooms.forEach(insideRooms => {
            insideRooms.forEach(room => room.generate());
        }); 


        this.room = this.getRandomRoom();
        this.room.build();
        this.room.visited = true;
    }

    render() {
        this.room.render();

        if (!this.characterReference) {
            this.characterReference = gameManager.getByTag(Character.TAG);
        }

        let characterPosition = this.characterReference.position;
        let newRoom;
        
        if (characterPosition.y < 0) newRoom = this.getRoom(this.room.x, this.room.y - 1, Room.UP);
        if (characterPosition.y > GameManager.CANVAS_Y) newRoom = this.getRoom(this.room.x, this.room.y + 1, Room.DOWN);
        if (characterPosition.x < 0) newRoom = this.getRoom(this.room.x + 1, this.room.y, Room.LEFT);
        if (characterPosition.x > GameManager.CANVAS_X) newRoom = this.getRoom(this.room.x - 1, this.room.y, Room.RIGHT);

        if (newRoom) {
            this.room.destroy();

            this.room = newRoom;
            this.room.build();
            this.room.visited = true;

            switch(this.room.direction) {
                case Room.UP:
                    this.characterReference.position = createVector(characterPosition.x, GameManager.CANVAS_Y - 50);
                    break;
                case Room.DOWN:
                    this.characterReference.position = createVector(characterPosition.x, 50);
                    break;
                case Room.LEFT:
                    this.characterReference.position = createVector(GameManager.CANVAS_X - 50, characterPosition.y);
                    break;
                case Room.RIGHT:
                    this.characterReference.position = createVector(50, characterPosition.y);
                    break;
            }
        }
    }

    generate() {
        let stack = [];
        
        let initial = this.getRandomRoom();
        initial.visited = true;
        stack.push(initial);
        
        while (stack.length != 0) {
            let current = stack.pop();
            
            let neighbors = this.getNeighbors(current);
            if (neighbors.length == 0) continue;
            
            stack.push(current);
            
            let nextRoom = random(neighbors);
            nextRoom.visited = true;
            
            let direction = nextRoom.direction;
            current.walls[direction] = false;
            nextRoom.walls[Room.getOppositeDirection(direction)] = false;
            
            stack.push(nextRoom);
        }

        // clear cells visited property
        this.rooms.forEach(insideRooms => {
            insideRooms.forEach(room => (room.visited = false));
        })
    }
        
    getNeighbors(room) {
        let neighbors = [];
        
        let up = this.getRelative(room, Room.UP);
        if (up && !up.visited) neighbors.push(up);
        
        let down = this.getRelative(room, Room.DOWN);
        if (down && !down.visited) neighbors.push(down);
        
        let left = this.getRelative(room, Room.LEFT);
        if (left && !left.visited) neighbors.push(left);
        
        let right = this.getRelative(room, Room.RIGHT);
        if (right && !right.visited) neighbors.push(right);
        
        return neighbors;
    }
    
    getRoom(x, y) {
        return this.getRoom(x, y, 0);
    }
    
    getRoom(x, y, direction) {
        if (x >= RoomManager.ROWS || x < 0 || y >= RoomManager.COLUMNS || y < 0) return null;
        
        let room = this.rooms[y][x];
        room.direction = direction;
        return room;
    }

    getRelative(room, direction) {
        switch (direction) {
            case Room.UP:
                return this.getRoom(room.x, room.y - 1, Room.UP);
            case Room.DOWN:
                return this.getRoom(room.x, room.y + 1, Room.DOWN);
            case Room.LEFT:
                return this.getRoom(room.x - 1, room.y, Room.LEFT);
            case Room.RIGHT:
                return this.getRoom(room.x + 1, room.y, Room.RIGHT);
        }
        return null;
    }
    
    getRandomRoom() {
        let ranX = floor(random(0, RoomManager.ROWS));
        let ranY = floor(random(0, RoomManager.COLUMNS));
        return this.getRoom(ranX, ranY);
    }

}

class Room {

    static UP = 0;
    static DOWN = 1;
    static RIGHT = 2;
    static LEFT = 3;

    static getOppositeDirection(direction) {
        if (direction % 2 == 0) return direction + 1;
        return direction - 1;
    } 
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.walls = [ true, true, true, true ];
        this.tiles = [];
        this.enemies = [];
        this.weight = 0;
    }

    generate() {
        let check = (bound1, max1, bound2, max2, doorIndex) => (bound1 >= (max1 / 2 - 3) && bound1 <= (max1 / 2 + 3)) && (bound2 == max2) && !this.walls[doorIndex];

        noiseSeed(random(0, 100));
        this.weight = floor(noise(this.x, this.y) * 100);

        this.tiles = [];
        for (let column = 0; column < TileManager.COLUMNS; ++column) {
            this.tiles[column] = [];
            for (let row = 0; row < TileManager.ROWS; ++row) {
                
                // m, j is column
                // n, i is rows

                let rarity = floor(noise(row * .05, column * .05) * 100);
                let sand = tileManager.getTilesByType(TileManager.Types.SAND);

                let tileType = random(sand.filter(tile => (tile.properties.rarity >= rarity)));
                if (!tileType) tileType = sand[0]; // default tilea

                if(row == 0 || column == 0 || row == TileManager.ROWS-1 || column == TileManager.COLUMNS-1) {
                    if (!(check(row, TileManager.ROWS - 1, column, 0, Room.UP) 
                     || check(row, TileManager.ROWS - 1, column, TileManager.COLUMNS - 1, Room.DOWN)
                     || check(column, TileManager.COLUMNS - 1, row, 0, Room.RIGHT)
                     || check(column, TileManager.COLUMNS - 1, row, TileManager.ROWS - 1, Room.LEFT))) {
                        tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_SAND));
                    }
                }

                this.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
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
                    this.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
                    ++row;
                }
        
                if(left > 0)
                    --left;
        
                while(row < TileManager.ROWS - 1) {
                    if(row > TileManager.ROWS / 2 + 3 && row >= right) {
                        let tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_SAND));
                        this.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
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
                    this.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
                    ++row;
                }
                if(left > 0)
                    --left;
        
                while(row < TileManager.ROWS - 1) {
                    if(row > TileManager.ROWS / 2 + 3 && row >= right) {
                        let tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_SAND));
                        this.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
                    }
                    ++row;
                }
                ++right;
            }
        }

        this.enemies.push(new Pufferfish(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
        this.enemies.push(new Clam(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
        this.enemies.push(new Shark(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
        this.enemies.push(new Urchin(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
        this.enemies.push(new Crab(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
        this.enemies.push(new SpeedBoost(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
        this.enemies.push(new HealthBoost(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
        
    }
    
    build() {
        this.graphics = createGraphics(GameManager.CANVAS_X, GameManager.CANVAS_Y);
        this.tiles.forEach(column => {
            column.forEach(item => {
                var tile = tileManager.tiles[item.type];
                this.graphics.image(tile, item.row * TileManager.TILE_SIZE, item.column * TileManager.TILE_SIZE);
            });
        })

        this.enemies.forEach(enemy => {
            if (enemy.dead) {
                Utils.remove(this.enemies, enemy);
                return;
            }
            gameManager.queue(enemy)
        }); // respawn previously spawned enemies
    }

    destroy() {
        this.enemies.forEach(enemy => gameManager.dequeue(enemy)); // despawn enemies for later

        this.graphics.remove();
        this.graphics = null;
    }

    render() {
        image(this.graphics, 0, 0);
    }

    // check collision pre-movement
    willCollide(vector) {
        let column = floor(vector.y / TileManager.TILE_SIZE);
        let row = floor(vector.x / TileManager.TILE_SIZE);

        if (column < 0 || column >= TileManager.COLUMNS || row < 0 || row >= TileManager.ROWS) return false;
        let tile = this.tiles[column][row];
        
        return tile.collide;
    }

}