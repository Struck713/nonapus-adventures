class Maze {
    
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.matrix = [];
        for (let y = 0; y < this.height; y++) {
            this.matrix[y] = [];
            for (let x = 0; x < this.width; x++) {
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
    }
        
    getNeighbors(cell) {
        let neighbors = [];
        
        let up = this.getCell(cell.x, cell.y - 1, Cell.UP);
        if (up && !up.visited) neighbors.push(up);
        
        let down = this.getCell(cell.x, cell.y + 1, Cell.DOWN);
        if (down && !down.visited) neighbors.push(down);
        
        let left = this.getCell(cell.x - 1, cell.y, Cell.LEFT);
        if (left && !left.visited) neighbors.push(left);
        
        let right = this.getCell(cell.x + 1, cell.y, Cell.RIGHT);
        if (right && !right.visited) neighbors.push(right);
        
        return neighbors;
    }
    
    getCell(x, y) {
        return this.getCell(x, y, 0);
    }
    
    getCell(x, y, direction) {
        if (x >= this.width || x < 0 || y >= this.height || y < 0) return null;
        
        let cell = this.matrix[y][x];
        cell.direction = direction;
        return cell;
    }
    
    getRandomCell() {
        let ranX = floor(random(0, this.width));
        let ranY = floor(random(0, this.height));
        return this.getCell(ranX, ranY);
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

// generation algo
// for (let x = 0; x < maze.width; x++) {
//     for (let y = 0; y < maze.height; y++) {
//       let cell = maze.getCell(x, y);
//       let xOffset = x * 10;
//       let yOffset = y * 10;
      
//       if (cell.has(Cell.UP)) line(xOffset, yOffset, xOffset + 10, yOffset);
//       if (cell.has(Cell.LEFT)) line(xOffset, yOffset, xOffset, yOffset + 10);
//       if (cell.has(Cell.DOWN)) line(xOffset, yOffset + 10, xOffset + 10, yOffset + 10);
//       if (cell.has(Cell.RIGHT)) line(xOffset + 10, yOffset, xOffset + 10, yOffset + 10);
//     }
// }