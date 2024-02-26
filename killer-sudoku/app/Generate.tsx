/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Generates a valid (full?) sudoku board
 * @date     February 26, 2024
*/

import { SpaceButtonProperties } from "./Sudoku";

// Gonna work on generating the sudoku board here, this file is one big pile of TODO

/**
 * @brief TODO
 * @returns TODO
 */
export function generate(): SpaceButtonProperties[][] {
    let arr: SpaceButtonProperties[][] = [];

    // Initialization Loop
    for (let i = 0; i < 9; i++) {
        arr[i] = []; // <-- Don't change unless better solution, need to fill the initial columns with a row vector.
        for (let j = 0; j < 9; j++) {
            arr[i][j] = {row: i, col: j, data: '0', highlighted: 'space', locked: false, spaceTakenInRowOrColumn: false};
        }
    }

    // Number Generation Loop



    return arr;
}  
