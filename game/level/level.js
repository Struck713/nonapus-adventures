class LevelManager {

    static ROWS = 5;
    static COLUMNS = 5;

    constructor(tileManager) {
        this.tileManager = tileManager;

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
            insideLevels.forEach(level => level.generate(this.tileManager.tiles));
        }); 


        this.level = this.getRandomLevel();
        this.level.build(this.tileManager.tiles);
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
            this.level.build(this.tileManager.tiles);
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
            current.remove(direction);
            nextLevel.remove(Level.getOppositeDirection(direction));
            
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
        this.tileMatrix = [];
    }

    generate(tiles) {
        let check = (bound1, max1, bound2, max2, doorIndex) => (bound1 >= (max1 / 2 - 3) && bound1 <= (max1 / 2 + 3)) && (bound2 == max2) && !this.walls[doorIndex];
        
        this.tileMatrix = [];
        for (let column = 0; column < TileManager.COLUMNS; ++column) {
            this.tileMatrix[column] = [];
            for (let row = 0; row < TileManager.ROWS; ++row) {
                let tileType = 0;

                // m, j is column
                // n, i is rows

                if(row == 0 || column == 0 || row == TileManager.ROWS-1 || column == TileManager.COLUMNS-1) {
                    if (check(row, TileManager.ROWS - 1, column, 0, Level.UP)) tileType = random(TileUtil.PLAIN_SAND);
                    else if (check(row, TileManager.ROWS - 1, column, TileManager.COLUMNS - 1, Level.DOWN)) tileType = random(TileUtil.PLAIN_SAND);
                    else if (check(column, TileManager.COLUMNS - 1, row, 0, Level.RIGHT)) tileType = random(TileUtil.PLAIN_SAND);
                    else if (check(column, TileManager.COLUMNS - 1, row, TileManager.ROWS - 1, Level.LEFT)) tileType = random(TileUtil.PLAIN_SAND);
                    else tileType = random(TileUtil.BORDER_SAND);
                } else {
                    if(random(0, 100) < 5) tileType = random(TileUtil.FILL_SAND);
                    else tileType = random(TileUtil.PLAIN_SAND);
                }
                
                this.tileMatrix[column][row] = new Tile(tileType, tiles[tileType].collide, row, column);
            }
        }
    /*
        let tileType = random(TileUtil.BORDER_SAND);

        let roundingAmount = 6;
        let left = roundingAmount;
        let right = TileManager.ROWS - roundingAmount;

        for(let column = 1; column < TileManager.COLUMNS - 1; ++column){
            let row = 1;

            if(column < TileManager.COLUMNS - 3){
                while(row < column){
                    tileType = random(TileUtil.BORDER_SAND);
                    ++row;
                    this.tileMatrix[column][row] = new Tile(tileType, tiles[tileType].collide, row, column);
                }

                if(left > 0)
                    --left;

                while(row = TileManager.COLUMNS - 1){
                    if(row > TileManager.COLUMNS / 2 + 3 && row >= right)
                        tileType = random(TileUtil.BORDER_SAND);
                        this.tileMatrix[column][row] = new Tile(tileType, tiles[tileType].collide, row, column);

                    ++row;
                }
                ++right;
            }
        }

        left = roundingAmount;
        right = TileManger.COLUMNS - roundingAmount - 1;

        for(let rows = TileManager.COLUMNS - 1; rows > 1; --rows) {
            columns = 1;

            if(rows > TileManger.COLUMNS / 2 + 3){
                while(columns <= 1) {
                    tileType = random(TileUtil.BORDER_SAND);
                    this.tileMatrix[column][row] = new Tile(tileType, tiles[tileType].collide, row, column);
                    ++columns;
                }

                if(left > 0)
                    --left;

                while(columns < TileManger.ROWS - 1) {
                    if(columns >= TileManger.ROWS / 2 + 3 && columns >= right) {
                        tileType = random(TileUtil.BORDER_SAND);
                        this.tileMatrix[column][row] = new Tile(tileType, tiles[tileType].collide, row, column);
                    }
                    ++column;
                }
                ++right;
            }
        }
        */
    }
    build(tiles) {
        this.graphics = createGraphics(GameManager.CANVAS_X, GameManager.CANVAS_Y);
        this.tileMatrix.forEach(column => {
            column.forEach(item => {
                var tile = tiles[item.type];
                this.graphics.image(tile, item.row * TileManager.TILE_SIZE, item.column * TileManager.TILE_SIZE);
            });
        })
    }

    destroy() {
        this.graphics.remove();
        this.graphics = null;
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

    has(index) {
        return this.walls[index];
    }

    remove(index) {
        this.walls[index] = false;
    }

}