#include <iostream>
#include <fstream>
#include <ctime>
#include <string>
#include <time.h>

using std::cout; using std::endl; using std::cin;
using std::ofstream;
using std::string;

const int matrixSizeN = 30;
const int matrixSizeM = 23;

const int allTilesCount = 26;

const int plainSandCount = 2;
const int borderSandCount = 2;
const int fillSandCount = 11;

const string allTiles[allTilesCount] = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16",
                                        "17", "18", "19", "20", "21", "22", "23", "24", "25"};
const string plainSand[plainSandCount] = {"0", "6"};
const string borderSand[borderSandCount] = {"11", "12"};
const string fillSand[fillSandCount] = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"};

const bool allDoorsComb[16][4] = {{0, 0, 0, 0}, {0, 0, 0, 1}, {0, 0, 1, 0}, {0, 1, 0, 0},
                                  {0, 1, 0, 1}, {0, 1, 1, 0}, {0, 1, 1, 1}, {1, 0, 0, 0},
                                  {1, 0, 0, 1}, {1, 0, 1, 0}, {1, 0, 1, 1}, {1, 1, 0, 0},
                                  {1, 1, 0, 1}, {1, 1, 1, 0}, {1, 1, 0, 1}, {1, 1, 1, 1}
                                 };

class Cell {
public:
    Cell() {
        for(int i = 0; i < matrixSizeN; ++i) {
            for(int j = 0; j < matrixSizeM; ++j) {
                matrix_[i][j] = plainSand[0];
            }
        }

        for(int i = 0; i < 4; ++i)
            doors_[i] = false;
    }

    ~Cell(){}

    void setDoors(const bool doorsLoc[]){
        doors_[0] = doorsLoc[0];
        doors_[1] = doorsLoc[1];
        doors_[2] = doorsLoc[2];
        doors_[3] = doorsLoc[3];
    }

    void matrixConstruct(bool randFill = false, int randSeed = 0) {
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
    }
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
    void doorsConstruct(){
        for(int i = 0; i < matrixSizeN; ++i) {
            for(int j = 0; j < matrixSizeM; ++j) {
                if ((i >= ((matrixSizeN / 2) - 3) && i <= (matrixSizeN / 2) + 3) && (j == 0 && doors_[0]))
                    matrix_[i][j] = plainSand[rand()%plainSandCount] + ", ";
                
                if ((i >= ((matrixSizeN / 2) - 3) && i <= (matrixSizeN / 2) + 3) && (j == (matrixSizeM - 1) && doors_[1]))
                    matrix_[i][j] = plainSand[rand()%plainSandCount] + ", ";
                
                if((j >= ((matrixSizeM / 2) - 3) && j <= (matrixSizeM / 2) + 3) && (i == 0 && doors_[2]))
                    matrix_[i][j] = plainSand[rand()%plainSandCount] + ", ";
                
                if((j >= ((matrixSizeM / 2) - 3) && j <= (matrixSizeM / 2) + 3) && (i == (matrixSizeN - 1) && doors_[3]))
                    matrix_[i][j] = plainSand[rand()%plainSandCount] + ", "; 

            }
        }
    }

    void draw() {
        for(int i = 0; i < matrixSizeN; ++i){
            for(int j = 0; j < matrixSizeM; ++j){
                cout << matrix_[i][j];
            }
            cout << endl;
        }
    }

    void outputToFile(ofstream& outputFile) {
        for(int i = 0; i < matrixSizeN; ++i){
            for(int j = 0; j < matrixSizeM; ++j){
                outputFile << matrix_[i][j];
            }
            outputFile << endl;
        }
        outputFile << endl;
    }


private:
    string matrix_[matrixSizeN][matrixSizeM];
    bool doors_[4];
};

int main() {
    srand(time(0));
    ofstream outputFile;
    outputFile.open("output.txt");

    string doorLocations[4] = {"Left, " "Right, " "Top, " "Bottom, "};
    string doorConcat = "Doors: ";

    int noiseChance = 0;
    int loopIterations = 1;
    char randFillSelect, sSelect, allSelect;
    bool randomFill = false;

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
        cout << " @ Create all 16 matrices at once? [y/n]: ";
        cin >> allSelect;

        if(allSelect != 'y'){
            cout << " @ Iterations? ";
            cin >> loopIterations;
        }
    }
    cout << endl;
    Cell cellMatrix;

    if(allSelect == 'y'){
        for(int i = 0; i < 16; ++i) {
            cellMatrix.matrixConstruct(randomFill, noiseChance);
            cellMatrix.setDoors(allDoorsComb[i]);
            cellMatrix.doorsConstruct();
            cellMatrix.outputToFile(outputFile);
        }


    } else {

    // seeding is 0-100, 100 being most noise
        cellMatrix.chooseDoors();
        for(int i = 0; i < loopIterations; ++i) {
            cellMatrix.matrixConstruct(randomFill, noiseChance);
            cellMatrix.doorsConstruct();
            cellMatrix.outputToFile(outputFile);
        }
    }

    cout << endl << "Goodbye." << endl;


    outputFile.close();
    return 0;
}