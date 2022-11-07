const matrixSizeM = 30;
const matrixSizeN = 23;

const allTilesCount = 26;

const plainSandCount = 2;
const borderSandCount = 2;

const fillSandCount = 11;

const allTiles = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",
                  "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];

const plainSand = ["0", "6"];
const borderSand = ["11", "12"];
const fillSand = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const allDoorsComb = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0], [0, 0, 1, 1],
                      [0, 1, 0, 0], [0, 1, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1],
                      [1, 0, 0, 0], [1, 0, 0, 1], [1, 0, 1, 0], [1, 0, 1, 1],
                      [1, 1, 0, 0], [1, 1, 0, 1], [1, 1, 1, 0], [1, 1, 1, 1]];

class Cell {
    constructor(){
        for(let i = 0; i < matrixSizeN; ++i){
            for(let j = 0; j < matrixSizeM; ++j)
                this.matrix_[i][j] = plainSand[0];
        }
        for(let i = 0; i < 4; ++i)
            this.doors_[i] = false;
    }
}
