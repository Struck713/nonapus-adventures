class LevelManager {

    static ROWS = 5;
    static COLUMNS = 5;
    static TILE_SIZE = 32;
    static TILE_SIZE_HALF = LevelManager.TILE_SIZE / 2;

    constructor() {
        this.tiles = [];
        this.layout = new LevelLayout();
    }

    constructor() {
        this.tiles = [];
        this.levels = [];
        for (let y = 0; y < LevelManager.COLUMNS; y++) {
            this.matrix[y] = [];
            for (let x = 0; x < LevelLayout.ROWS; x++) {
                this.matrix[y][x] = new Level(x, y);
            }
        }
    }

    preload(toLoad) {
        this.tilesetImage = loadImage('../assets/levels/tileset.png'); //load tileset
        this.tilesetJSON = loadJSON('../assets/levels/tileset.json');

        for (let index = 0; index < toLoad; index++) {
            let level = new Level(index);
            level.preload();
            this.levels.push(level);
        }
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

        this.layout.generate();
        this.cell = this.layout.getRandomCell();
        this.cell.visited = true;

    }

    render() {
        this.current.render();

        if (!this.characterReference) {
            this.characterReference = gameManager.getByTag(Character.TAG);
        }

        let characterPosition = this.characterReference.position;
        let newCell;
        
        if (characterPosition.y < 0) newCell = this.layout.getCell(this.cell.x, this.cell.y - 1, Cell.UP);
        if (characterPosition.y > GameManager.CANVAS_Y) newCell = this.layout.getCell(this.cell.x, this.cell.y + 1, Cell.DOWN);
        if (characterPosition.x < 0) newCell = this.layout.getCell(this.cell.x + 1, this.cell.y, Cell.LEFT);
        if (characterPosition.x > GameManager.CANVAS_X) newCell = this.layout.getCell(this.cell.x - 1, this.cell.y, Cell.RIGHT);

        if (newCell) {
            this.cell = newCell;
            this.cell.visited = true;

            switch(this.cell.direction) {
                case Cell.UP:
                    this.characterReference.position = createVector(characterPosition.x, GameManager.CANVAS_Y - 50);
                    break;
                case Cell.DOWN:
                    this.characterReference.position = createVector(characterPosition.x, 50);
                    break;
                case Cell.LEFT:
                    this.characterReference.position = createVector(GameManager.CANVAS_X - 50, characterPosition.y);
                    break;
                case Cell.RIGHT:
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
        this.matrix.forEach(levels => {
            levels.forEach(level => (level.visited = false));
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
        if (x >= LevelLayout.LEVEL_WIDTH || x < 0 || y >= LevelLayout.LEVEL_HEIGHT || y < 0) return null;
        
        let level = this.matrix[y][x];
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
        return this.getCell(ranX, ranY);
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

    load(tiles) {
        this.tileMatrix = [];
        for (let column = 0; column < LevelManager.COLUMNS; ++column) {
            this.tileMatrix[column] = [];
            for (let row = 0; row < LevelManager.ROWS; ++row) {
                var offsetX = row * LevelManager.TILE_SIZE;
                var offsetY = column * LevelManager.TILE_SIZE;

                this.tileMatrix[column][row] = 
                    new Tile(tileIndex,
                        tiles[tileIndex].collide,
                        row, 
                        column, 
                        { 
                            x: offsetX, 
                            y: offsetY, 
                        }
                    );
            }
        }
    }

    build(tiles) {
        this.graphics = createGraphics(GameManager.CANVAS_X, GameManager.CANVAS_Y);
        this.tileMatrix.forEach(column => {
            column.forEach(item => {
                var tile = tiles[item.index];
                this.graphics.image(tile, item.center.x, item.center.y);
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