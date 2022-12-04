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
            insideRooms.forEach(room => room.initialize());
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
    
    getRoom(x, y) { return this.getRoom(x, y, 0); }
    
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
        this.objects = [];
        this.tiles = [];
    }

    initialize() {
        noiseSeed(random(0, 100));
        this.weight = floor(noise(this.x, this.y) * 100);

        RoomGenerators.BASIC.generate(this);
        // Boss battle comment out = off
        //this.spawn(new Boss(GameManager.CANVAS_X + 100, GameManager.CANVAS_Y / 2), false);

    //    for (let i = 0; i < random(1, 5); ++i){
    //         let randPosition = this.randomPosition();
    //         this.spawn(Enemy.random(randPosition.x, randPosition.y), false);
    //    }

    //    for (let i = 0; i < random(1, 3); ++i){
    //         let randPosition = this.randomPosition();
    //         this.spawn(Collectable.random(randPosition.x, randPosition.y), false);
    //    }

    //    let randPosition = this.randomPosition();
        this.spawn(new ElectricEel(192, 192), false);
    //    let scale = 150;

    //    for (let i = 0; i < WaveUtils.CIRCLE_12.length; ++i) {
    //         let adjustmentPosition = WaveUtils.CIRCLE_12[i];
    //         this.spawn(new Clam((GameManager.CANVAS_X / 2) + (scale * adjustmentPosition.x), (GameManager.CANVAS_Y / 2) + (scale * adjustmentPosition.y)), false);
    //    }
        
    }
    
    build() {
        this.graphics = createGraphics(GameManager.CANVAS_X, GameManager.CANVAS_Y);
        this.tiles.forEach(column => {
            column.forEach(item => {
                var tile = tileManager.tiles[item.type];
                this.graphics.image(tile, item.row * TileManager.TILE_SIZE, item.column * TileManager.TILE_SIZE);
            });
        })

        this.objects.forEach(object => {
            if (object.dead) {
                Utils.remove(this.objects, object);
                return;
            }
            gameManager.queue(object);
        }); // respawn previously spawned enemies
    }

    destroy() {
        this.objects.forEach(enemy => gameManager.dequeue(enemy)); // despawn enemies for later
        gameManager.getByClass(Projectile).forEach(projectile => projectile.destroy()); // destroy projectiles

        this.graphics.remove();
        this.graphics = null;
    }

    render() { image(this.graphics, 0, 0); }

    // check collision pre-movement
    willCollide(vector) {
        let column = floor(vector.y / TileManager.TILE_SIZE);
        let row = floor(vector.x / TileManager.TILE_SIZE);

        if (column < 0 || column >= TileManager.COLUMNS || row < 0 || row >= TileManager.ROWS) return false;
        let tile = this.tiles[column][row];
        
        return tile.collide;
    }

    // returns a random vector that is not within a tile
    randomPosition() {
        let column = floor(random(1, TileManager.COLUMNS - 1));
        let rows = this.tiles[column];
        let nonCollideableRows = rows.filter(row => (row.collide == false));
        let tile = random(nonCollideableRows);
        return createVector(tile.row * TileManager.TILE_SIZE, tile.column * TileManager.TILE_SIZE);
    }

    spawn(object, needsQueued=true) {
        this.objects.push(object);
        if (needsQueued) gameManager.queue(object);
    }
}