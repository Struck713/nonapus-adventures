class LevelManager {

    static ROWS = 5;
    static COLUMNS = 5;

    constructor() {
        this.levels = [];
        for (let y = 0; y < LevelManager.COLUMNS; y++) {
            this.levels[y] = [];
            for (let x = 0; x < LevelManager.ROWS; x++) {
                this.levels[y][x] = new Level(x, y);
            }
        }
    }

    load() {
        this.generate(); // generate the wall sequence

         //generate individual level layout
        this.levels.forEach(insideLevels => {
            insideLevels.forEach(level => level.generate());
        }); 


        this.level = this.getRandomLevel();
        this.level.build();
        this.level.visited = true;
    }

    render() {
        this.level.render();

        if (!this.characterReference) {
            this.characterReference = gameManager.getByTag(Character.TAG);
        }

        let characterPosition = this.characterReference.position;
        let newLevel;
        
        if (characterPosition.y < 0) newLevel = this.getLevel(this.level.x, this.level.y - 1, Level.UP);
        if (characterPosition.y > GameManager.CANVAS_Y) newLevel = this.getLevel(this.level.x, this.level.y + 1, Level.DOWN);
        if (characterPosition.x < 0) newLevel = this.getLevel(this.level.x + 1, this.level.y, Level.LEFT);
        if (characterPosition.x > GameManager.CANVAS_X) newLevel = this.getLevel(this.level.x - 1, this.level.y, Level.RIGHT);

        if (newLevel) {
            this.level.destroy();

            this.level = newLevel;
            this.level.build();
            this.level.visited = true;

            switch(this.level.direction) {
                case Level.UP:
                    this.characterReference.position = createVector(characterPosition.x, GameManager.CANVAS_Y - 50);
                    break;
                case Level.DOWN:
                    this.characterReference.position = createVector(characterPosition.x, 50);
                    break;
                case Level.LEFT:
                    this.characterReference.position = createVector(GameManager.CANVAS_X - 50, characterPosition.y);
                    break;
                case Level.RIGHT:
                    this.characterReference.position = createVector(50, characterPosition.y);
                    break;
            }
        }
    }

    generate() {
        let stack = [];
        
        let initial = this.getRandomLevel();
        initial.visited = true;
        stack.push(initial);
        
        while (stack.length != 0) {
            let current = stack.pop();
            
            let neighbors = this.getNeighbors(current);
            if (neighbors.length == 0) continue;
            
            stack.push(current);
            
            let nextLevel = random(neighbors);
            nextLevel.visited = true;
            
            let direction = nextLevel.direction;
            current.walls[direction] = false;
            nextLevel.walls[Level.getOppositeDirection(direction)] = false;
            
            stack.push(nextLevel);
        }

        // clear cells visited property
        this.levels.forEach(insideLevels => {
            insideLevels.forEach(level => (level.visited = false));
        })
    }
        
    getNeighbors(level) {
        let neighbors = [];
        
        let up = this.getRelative(level, Level.UP);
        if (up && !up.visited) neighbors.push(up);
        
        let down = this.getRelative(level, Level.DOWN);
        if (down && !down.visited) neighbors.push(down);
        
        let left = this.getRelative(level, Level.LEFT);
        if (left && !left.visited) neighbors.push(left);
        
        let right = this.getRelative(level, Level.RIGHT);
        if (right && !right.visited) neighbors.push(right);
        
        return neighbors;
    }
    
    getLevel(x, y) {
        return this.getLevel(x, y, 0);
    }
    
    getLevel(x, y, direction) {
        if (x >= LevelManager.ROWS || x < 0 || y >= LevelManager.COLUMNS || y < 0) return null;
        
        let level = this.levels[y][x];
        level.direction = direction;
        return level;
    }

    getRelative(level, direction) {
        switch (direction) {
            case Level.UP:
                return this.getLevel(level.x, level.y - 1, Level.UP);
            case Level.DOWN:
                return this.getLevel(level.x, level.y + 1, Level.DOWN);
            case Level.LEFT:
                return this.getLevel(level.x - 1, level.y, Level.LEFT);
            case Level.RIGHT:
                return this.getLevel(level.x + 1, level.y, Level.RIGHT);
        }
        return null;
    }
    
    getRandomLevel() {
        let ranX = floor(random(0, LevelManager.ROWS));
        let ranY = floor(random(0, LevelManager.COLUMNS));
        return this.getLevel(ranX, ranY);
    }

}

class Level {

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
    }

    generate() {
        let check = (bound1, max1, bound2, max2, doorIndex) => (bound1 >= (max1 / 2 - 3) && bound1 <= (max1 / 2 + 3)) && (bound2 == max2) && !this.walls[doorIndex];

        noiseSeed(random(0, 100));

        this.tiles = [];
        for (let column = 0; column < TileManager.COLUMNS; ++column) {
            this.tiles[column] = [];
            for (let row = 0; row < TileManager.ROWS; ++row) {
                
                // m, j is column
                // n, i is rows

                let tileType;
                let rarity = floor(noise(row * .05, column * .05) * 100);
                let sand = tileManager.getTilesByType(TileManager.Types.SAND);
                tileType = random(sand.filter(tile => (tile.properties.rarity >= rarity)));
                
                if(row == 0 || column == 0 || row == TileManager.ROWS-1 || column == TileManager.COLUMNS-1) {
                    if (!(check(row, TileManager.ROWS - 1, column, 0, Level.UP) 
                     || check(row, TileManager.ROWS - 1, column, TileManager.COLUMNS - 1, Level.DOWN)
                     || check(column, TileManager.COLUMNS - 1, row, 0, Level.RIGHT)
                     || check(column, TileManager.COLUMNS - 1, row, TileManager.ROWS - 1, Level.LEFT))) {
                        tileType = random(tileManager.getTilesByType(TileManager.Types.BORDER_SAND));
                    }
                }

                this.tiles[column][row] = new Tile(tileType.index, tileType.properties.collide, row, column);
            }
        }

        this.enemies.push(new Pufferfish(200, 200));

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

}