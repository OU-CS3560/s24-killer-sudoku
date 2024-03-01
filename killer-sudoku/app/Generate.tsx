/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Generates a valid (full?) sudoku board
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting } from "./Sudoku";

/**
 * @brief Initializes the board to be a 2d array, generates a board full of 
 *        data with SpaceButtonProperties, and highlights the origin to start.
 * @returns A 9x9 board
 */
export function initBoard(): SpaceButtonProperties[][] {

    /**
     * @brief Swaps a row in (values) with a different one
     * @param r1 row 1
     * @param r2 row 2
     */
    function swapRow(r1: number, r2: number): void {
        let temp: string[] = values[r1];
        values[r1] = values[r2];
        values[r2] = temp;
    }

    /**
     * @brief Swaps a column in (values) with a different one
     * @param c1 col 1
     * @param c2 col 2
     */
    function swapCol(c1: number, c2: number): void {
        for (let i = 0; i < 9; i++) {
            let temp: string = values[i][c1];
            values[i][c1] = values[i][c2];
            values[i][c2] = temp;
        }
    }

    
    let values: string[][] = [ // Start with a valid Sudoku board, shuffle it in a way that it stays valid
        ['1','2','3',  '4','5','6',  '7','8','9'],
        ['4','5','6',  '7','8','9',  '1','2','3'],
        ['7','8','9',  '1','2','3',  '4','5','6'],

        ['2','3','1',  '5','6','4',  '8','9','7'],
        ['5','6','4',  '8','9','7',  '2','3','1'],
        ['8','9','7',  '2','3','1',  '5','6','4'],

        ['3','1','2',  '6','4','5',  '9','7','8'],
        ['6','4','5',  '9','7','8',  '3','1','2'],
        ['9','7','8',  '3','1','2',  '6','4','5']
    ];

    for (let i = 0; i < 9; i++) { // Randomly swap row/col with a different one in the same set of 3
        let row: number = Math.floor(i/3)*3 + rand(0,2);
        swapRow(i,row);
        let col: number = Math.floor(i/3)*3 + rand(0,2);
        swapCol(i,col);
    }

    for (let r3x3_1 = 0; r3x3_1 < 3; r3x3_1++) { // Randomly swap set of 3 rows/cols with a different one
        let r3x3_2: number = rand(0,2);
        for (let i = 0; i < 3; i++) {
            swapRow(r3x3_1 *3 +i, r3x3_2 *3 +i);
        }
        r3x3_2 = rand(0,2);
        for (let i = 0; i < 3; i++) {
            swapCol(r3x3_1 *3 +i, r3x3_2 *3 +i);
        }
    }

    for (let i1 = 1; i1 < 9; i1++) { // Randomize the placement of each set of numbers. kinda redundant but why not
        let i2: number = rand(1,9);
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (Number(values[x][y]) == i1) {values[x][y] = i2.toString();} 
                else 
                if (Number(values[x][y]) == i2) {values[x][y] = i1.toString();}
            }
        }
    }

    // TODO: i'd say hide/erase x-number of tiles (aka show as empty), as per game difficulty listed below
    // After that, the board should still have at least 1 solution

    // NOTES: # of tiles hidden:
    // --> Easy:     42,45,45,44 --> Avg 44
    // --> Medium:   51,46,51,49 --> Avg 49
    // --> Hard:     (TODO)
    // --> Export:   
    // --> Master:   
    // --> K-Easy:   
    // --> K-Medium: 
    // --> K-Hard:   
    // --> K-Expert: 

    // Initialization Loop
    let arr: SpaceButtonProperties[][] = [];
    for (let i = 0; i < 9; i++) {
        arr[i] = []; // Don't change unless better solution, need to fill the initial columns with a row vector.
        for (let j = 0; j < 9; j++) {
            arr[i][j] = {data: values[i][j], hiddenData: values[i][j],highlighted: 'space', locked: false};
        }
    }

    // Initially highlight the board at the origin
    HandleHighlighting(4, 4, arr);

    return arr;
}

/**
 * @brief Random number generator, in range (a,b) inclusive
 * @param a lower limit
 * @param b upper limit
 * @returns random value between a & b
 */
function rand(a: number, b: number): number {
    return Math.floor(Math.random() * (b-a+1) + a);
};

