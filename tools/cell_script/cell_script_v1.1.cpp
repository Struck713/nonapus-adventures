#include <iostream>
#include <fstream>
#include <ctime>
#include <string>
#include <time.h>

using std::cout; using std::endl; using std::cin;
using std::ofstream;
using std::string;

const int matrixSizeM = 30;
const int matrixSizeN = 23;

const int allTilesCount = 26;

const int plainSandCount = 2;
const int borderSandCount = 2;

const int fillSandCount = 11;

const string allTiles[allTilesCount] = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16",
                                        "17", "18", "19", "20", "21", "22", "23", "24", "25"};
const string plainSand[plainSandCount] = {"0", "6"};
const string borderSand[borderSandCount] = {"11", "12"};
const string fillSand[fillSandCount] = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"};

// All door combinations
// This is used the loop that outputs all possible matrices
const bool allDoorsComb[16][4] = {{0, 0, 0, 0}, {0, 0, 0, 1}, {0, 0, 1, 0}, {0, 0, 1, 1},
                                  {0, 1, 0, 0}, {0, 1, 0, 1}, {0, 1, 1, 0}, {0, 1, 1, 1},
                                  {1, 0, 0, 0}, {1, 0, 0, 1}, {1, 0, 1, 0}, {1, 0, 1, 1},
                                  {1, 1, 0, 0}, {1, 1, 0, 1}, {1, 1, 1, 0}, {1, 1, 1, 1}};

class Cell {
public:
    // default ctor
    Cell() {
        for(int i = 0; i < matrixSizeN; ++i) {
            for(int j = 0; j < matrixSizeM; ++j) {
                matrix_[i][j] = plainSand[0];
            }
        }
        for(int i = 0; i < 4; ++i)
            doors_[i] = false;
    }

    // dtor
    ~Cell(){ delete[] this; }

    // Input: bool array for door locations
    //        ex: {1, 0, 1, 0} = Left, Top
    //
    // Setter for doors that uses a common input.
    // Allows us to easily set and reset doors (especially in loops)
    void setDoors(const bool doorsLoc[]){
        doors_[0] = doorsLoc[0]; // Left
        doors_[1] = doorsLoc[1]; // Right
        doors_[2] = doorsLoc[2]; // Top
        doors_[3] = doorsLoc[3]; // Bottom
    }

    // Input: bool randFill to allow user the choice of special tile fill
    //        int randSeed specifies the %chance for a tile to be special
    //
    // This is the function doing the heavy lifting. This will actually construct
    // our matrices with a border and choice of fill.
    //
    // v1.1: Added door constructor function to this. Now we construct the entirety
    // of our matrices within this function!
    void matrixConstruct(bool randFill = false, int randSeed = 0) {
        // Plain fill
        if(randFill == false) {
            for(int i = 0; i < matrixSizeN; ++i) {
                for(int j = 0; j < matrixSizeM; ++j) {
                    if(i == 0 || j == 0 || i == matrixSizeN-1 || j == matrixSizeM-1)
                        if(j == 0)
                            matrix_[i][j] = "[" + borderSand[rand()%borderSandCount] + ", ";
                        else if(j == matrixSizeM-1)
                            matrix_[i][j] = borderSand[rand()%borderSandCount] + "]";
                        else
                            matrix_[i][j] = borderSand[rand()%borderSandCount] + ", ";
                    else
                        matrix_[i][j] = plainSand[rand()%plainSandCount] + ", ";
                }
            }
        }
        // Random special fill
        if(randFill == true) {
            for(int i = 0; i < matrixSizeN; ++i) {
                for(int j = 0; j < matrixSizeM; ++j) {
                    if(i == 0 || j == 0 || i == matrixSizeN-1 || j == matrixSizeM-1) {
                        if(j == 0)
                            matrix_[i][j] = "[" + borderSand[rand()%borderSandCount] + ", ";
                        else if(j == matrixSizeM-1)
                            matrix_[i][j] = borderSand[rand()%borderSandCount] + "]";
                        else
                            matrix_[i][j] = borderSand[rand()%borderSandCount] + ", ";
                    } else {
                        if(rand()%100 < randSeed)
                            matrix_[i][j] = fillSand[rand()%fillSandCount] + ", ";
                        else
                            matrix_[i][j] = plainSand[rand()%plainSandCount] + ", ";
                    }
                }
            }
        }
        // Door construction
        // Left and Right door is a special case because we need [ or ] in the string
        // Top and Bottom door are internal and therefore only need a comma ", "
        // We can actually account for both doors with one (albeit long) if statement
        for(int i = 0; i < matrixSizeN; ++i) {
            for(int j = 0; j < matrixSizeM; ++j) {
                // Left Door
                if (i >= (matrixSizeN / 2 - 3) && i <= (matrixSizeN / 2 + 3) && j == 0 && doors_[0])
                    matrix_[i][j] = "[" + plainSand[rand()%plainSandCount] + ", ";
                
                // Right Door
                if (i >= (matrixSizeN / 2 - 3) && i <= (matrixSizeN / 2 + 3) && j == (matrixSizeM - 1) && doors_[1])
                    matrix_[i][j] = plainSand[rand()%plainSandCount] + "]";
                
                // Top || Bottom Doors
                if((j >= (matrixSizeM / 2 - 3) && j <= (matrixSizeM / 2 + 3) && i == 0 && doors_[2]) || (j >= (matrixSizeM / 2 - 3) && j <= (matrixSizeM / 2 + 3) && i == (matrixSizeN - 1) && doors_[3]))
                    matrix_[i][j] = plainSand[rand()%plainSandCount] + ", ";
            }
        }
    }

    // Input: int roundingSize allows user input for rounding amount
    //
    // This function rounds the corners depending on user input.
    // Currently the rounding is sharp. It will be extremely difficult to do
    // this another way, and is probably not worth it.
    // This function is also unoptimized and could probably run better.
    // There are a lot of magic numbers, however I do not care.
    void roundCorners(int roundingSize){
        roundingSize += 1;

        // Can't cover doorways
        // This if prevents this
        if(roundingSize > 7)
            roundingSize = 6;

        // l: variable to determine rounding from the left
        int l = roundingSize;
        // r: variable to determine rounding from the right
        int r = matrixSizeM - roundingSize;

        // Top half of rounding
        // Approach matrix from top to bottom
        for(int i = 1; i < matrixSizeN - 1; ++i) {
            int j = 1;

            if(i < matrixSizeN - 3){
                while(j < l) {
                    matrix_[i][j] = borderSand[rand()%borderSandCount] + ", ";
                    ++j;
                }

                if(l > 0)
                    --l;

                while(j < matrixSizeM - 1){
                    if(j > matrixSizeM / 2 + 3 && j >= r) {
                        matrix_[i][j] = borderSand[rand()%borderSandCount] + ", ";
                    }
                    ++j;
                }
                ++r;
                
            }
        }

        l = roundingSize;
        r = matrixSizeM - roundingSize - 1;

        // Bottom half of rounding
        // Approach matrix from bottom to top
        //
        // I couldn't figure out a way to print from top to bottom
        // and get the bottom rounding working.
        for(int i = matrixSizeN - 1; i > 1; --i){
            int j = 1;

            if(i > matrixSizeN / 2 + 3){
                while(j <= l) {
                    matrix_[i][j] = borderSand[rand()%borderSandCount] + ", ";
                    ++j;
                }

                if(l > 0)
                    --l;

                while(j < matrixSizeM - 1){
                    if(j >= matrixSizeM / 2 + 3 && j >= r) {
                        matrix_[i][j] = borderSand[rand()%borderSandCount] + ", ";
                    }
                    ++j;
                }
                ++r;
                
            }
        }
    }

    // This allows user door input for custom matrices.
    // Nothing crazy, simply sets door array to user input.
    void chooseDoors(){
        char doorChar;
        cout << "Input door locations:" << endl;

        cout << " @ Left door? [y/n]: ";
        cin >> doorChar;
        if(doorChar == 'y')
            doors_[0] = true;
        else
            doors_[0] = false;

        cout << " @ Right door? [y/n]: ";
        cin >> doorChar;
        if(doorChar == 'y')
            doors_[1] = true;
        else
            doors_[1] = false;

        cout << " @ Top door? [y/n]: ";
        cin >> doorChar;
        if(doorChar == 'y')
            doors_[2] = true;
        else
            doors_[2] = false;

        cout << " @ Bottom door? [y/n]: ";
        cin >> doorChar;
        if(doorChar == 'y')
            doors_[3] = true;
        else
            doors_[3] = false;            
    }

    // Utility draw function allowing a us to print our matrices to console.
    // Useful for debugging
    void draw() const {
        for(int i = 0; i < matrixSizeN; ++i){
            for(int j = 0; j < matrixSizeM; ++j){
                cout << matrix_[i][j];
            }
            cout << endl;
        }
    }

    // Input: ofstream& of the file we want to output to
    //
    // This isn't very advanced. Our matrix constructor does acutal building of matrices.
    // This function just outputs the work already done.
    void outputToFile(ofstream& outputFile) const {
        for(int i = 0; i < matrixSizeN; ++i){
            for(int j = 0; j < matrixSizeM; ++j){
                outputFile << matrix_[i][j];
            }
            outputFile << endl;
        }
        outputFile << endl;
    }

private:
    // A two dimensional matrix of strings.
    // strings are useful because the output at each index has variable size.
    // strings allow easy concatenation
    string matrix_[matrixSizeN][matrixSizeM];

    // Here be the door locations
    bool doors_[4];
};

int main() {
    // Rand seeding.
    srand(time(0));

    // We need an ofstream in order to do file i/o.
    ofstream outputFile;
    outputFile.open("output.txt");

    // noiceChance is the %chance for special tiles.
    // Used within matrixConstruct().
    //
    // roundingSize is the amount of rounding done on corners.
    // Used within roundCorners().
    int noiseChance, roundingSize = 0;

    // Determines how many matrices the user wants.
    int loopIterations = 1;

    // Characters to determine settings.
    char randFillSelect, sSelect, allSelect, roundingSelect;

    // Assume randomFill is false unless user specifies.
    // Used within matrixConstruct()
    bool randomFill = false;

    // This is an instance of our class
    Cell cellMatrix;

    // Below is some logic for settings.
    // I hope it is mostly self explanitory.

    cout << "Default Settings:\n @ Random Fill: false\n @ Loop Iterations: 1\nSettings? [y/n]: ";
    cin >> sSelect;

    if(sSelect == 'y') {
        cout << " @ Randomize fill? [y/n]: ";
        cin >> randFillSelect;

        if(randFillSelect == 'y')
            randomFill = true;
        if(randomFill) {
            cout << " @ Noise amount? [0 - 100]: ";
            cin >> noiseChance;
        }
        cout << " @ Round Corners? [y/n]: ";
        cin >> roundingSelect;
        if(roundingSelect == 'y'){
            cout << " @ Rounding amount? [1-6]: ";
            cin >> roundingSize;
        }

        cout << " @ Create one iteration of all possible matrices at once?\n   This creates a single matrix of all 16 door variations. 16 total matrices [y/n]: ";
        cin >> allSelect;

        if(allSelect != 'y'){
            cout << " @ Iterations? [1 - 100]: ";
            cin >> loopIterations;
        }
    }

    // If user wants all door combinations then we pass this first if statement.
    if(allSelect == 'y'){
        for(int i = 0; i < 16; ++i) {
            cellMatrix.matrixConstruct(randomFill, noiseChance);
            cellMatrix.setDoors(allDoorsComb[i]);
            if(roundingSelect == 'y')
                cellMatrix.roundCorners(roundingSize);
            cellMatrix.outputToFile(outputFile);
        }
    // Otherwise the create a specific matrix type.
    // User chooses amount of iterations of this matrix.
    } else {
        cellMatrix.chooseDoors();
        for(int i = 0; i < loopIterations; ++i) {
            cellMatrix.matrixConstruct(randomFill, noiseChance);
            cout << roundingSelect << endl;

            if(roundingSelect == 'y')
                cellMatrix.roundCorners(roundingSize);

            cellMatrix.outputToFile(outputFile);
        }
    }

    cout << endl << "Output in 'output.txt'\nGoodbye." << endl;

    outputFile.close();
    return 0;
}