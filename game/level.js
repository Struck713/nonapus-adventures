class LevelManager {

    static TILE_SIZE = 32;
    static TILE_SIZE_HALF = LevelManager.TILE_SIZE / 2;

    constructor() {
        this.levels = []; // this is just a level template list
        this.tiles = [];
        this.level = 0; // index of current level
        this.layout = new LevelLayout();
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
            this.useLayout();

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

    generateLayout() {
        this.layout.generate();
        this.cell = this.layout.getRandomCell();
        this.cell.visited = true;
    }

    useLayout() {
        for (let index = 0; index < this.levels.length; index++) {
            let level = this.levels[index];
            if (Utils.compare(level.openings, this.cell.walls)) {
                
                // remove canvas for old level
                if (this.level != 0) this.current.destroy();

                // change to new level and build it
                this.level = index;
                this.current.build(this.tiles);

                return;
            }
        }
    }

    // returns a list of nearby tiles if they are collideable
    isCollideable(x, y) {

        return [ true, true, true, true ];

        // var tile = this.current.getTileByXY(x, y);
        // var up = this.current.getTileByRowColumn(tile.row, tile.column - 1);
        // var down = this.current.getTileByRowColumn(tile.row, tile.column + 1);
        // var left = this.current.getTileByRowColumn(tile.row - 1, tile.column);
        // var right = this.current.getTileByRowColumn(tile.row + 1, tile.column);

        // return [ 
        //     up.checkCollisionY(y), 
        //     down.checkCollisionY(y), 
        //     left.checkCollisionX(x), 
        //     right.checkCollisionX(x)
        // ];
    }

    get current() {
        return this.levels[this.level];
    }

}

class LevelLayout {

    static LEVEL_WIDTH = 5;
    static LEVEL_HEIGHT = 5;
    
    constructor() {
        this.matrix = [];
        for (let y = 0; y < LevelLayout.LEVEL_WIDTH; y++) {
            this.matrix[y] = [];
            for (let x = 0; x < LevelLayout.LEVEL_HEIGHT; x++) {
                this.matrix[y][x] = new Cell(x, y);
            }
        }
    }
        
    generate() {
        let stack = [];
        
        let initial = this.getRandomCell();
        initial.visited = true;
        stack.push(initial);
        
        while (stack.length != 0) {
            let current = stack.pop();
            
            let neighbors = this.getNeighbors(current);
            if (neighbors.length == 0) continue;
            
            stack.push(current);
            
            let nextCell = random(neighbors);
            nextCell.visited = true;
            
            let direction = nextCell.direction;
            current.remove(direction);
            nextCell.remove(Cell.getOppositeDirection(direction));
            
            stack.push(nextCell);
        }

        // clear cells visited property
        this.matrix.forEach(cells => {
            cells.forEach(cell => (cell.visited = false));
        })
    }
        
    getNeighbors(cell) {
        let neighbors = [];
        
        let up = this.getRelative(cell, Cell.UP);
        if (up && !up.visited) neighbors.push(up);
        
        let down = this.getRelative(cell, Cell.DOWN);
        if (down && !down.visited) neighbors.push(down);
        
        let left = this.getRelative(cell, Cell.LEFT);
        if (left && !left.visited) neighbors.push(left);
        
        let right = this.getRelative(cell, Cell.RIGHT);
        if (right && !right.visited) neighbors.push(right);
        
        return neighbors;
    }
    
    getCell(x, y) {
        return this.getCell(x, y, 0);
    }
    
    getCell(x, y, direction) {
        if (x >= LevelLayout.LEVEL_WIDTH || x < 0 || y >= LevelLayout.LEVEL_HEIGHT || y < 0) return null;
        
        let cell = this.matrix[y][x];
        cell.direction = direction;
        return cell;
    }

    getRelative(cell, direction) {
        switch (direction) {
            case Cell.UP:
                return this.getCell(cell.x, cell.y - 1, Cell.UP);
            case Cell.DOWN:
                return this.getCell(cell.x, cell.y + 1, Cell.DOWN);
            case Cell.LEFT:
                return this.getCell(cell.x - 1, cell.y, Cell.LEFT);
            case Cell.RIGHT:
                return this.getCell(cell.x + 1, cell.y, Cell.RIGHT);
        }
        return null;
    }
    
    getRandomCell() {
        let ranX = floor(random(0, LevelLayout.LEVEL_WIDTH));
        let ranY = floor(random(0, LevelLayout.LEVEL_HEIGHT));
        return this.getCell(ranX, ranY);
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
        this.openings = this.tileMatrixJSON.openings; // set walls
        let tileIndexes = this.tileMatrixJSON.layout;
        delete this.tileMatrixJSON;

        this.tileMatrix = [];
        for (let column = 0; column < GameManager.COLUMNS; ++column) {
            this.tileMatrix[column] = [];
            for (let row = 0; row < GameManager.ROWS; ++row) {
                var tileIndex = tileIndexes[column][row];
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
    
class Cell {
    
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
    }

    has(index) {
        return this.walls[index];
    }

    remove(index) {
        this.walls[index] = false;
    }
    
}