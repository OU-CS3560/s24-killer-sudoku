/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Generates a valid (full?) sudoku board
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting } from "./Sudoku";

/**
 * @brief Initializes the board to be a 2d array, generates a board full of data with SpaceButtonProperties, and highlights the origin to start.
 * @returns A 9x9 board
 */
export function initBoard(): SpaceButtonProperties[][] {

    // Number Generation
    let values: string[][] = [
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

    // Summary of what i plan
    // --> Take board above, its a valid Sudoku Board
    // --> Shift around certain values (rows? cols? 3x3s?) randomly such that the resulting board is still valid
    // --> Repeat as desired for a randomized full sudoku board
    //
    // Elsewhere, i'd say hide/erase x-number of tiles (aka show as empty), as per game difficulty
    // After that, the board should still have at least 1 solution

    // Initialization Loop
    let arr: SpaceButtonProperties[][] = [];
    for (let i = 0; i < 9; i++) {
        arr[i] = []; // <-- Don't change unless better solution, need to fill the initial columns with a row vector.
        for (let j = 0; j < 9; j++) {
            arr[i][j] = {row: i, col: j, data: values[i][j], highlighted: 'space', locked: false, spaceTakenInRowOrColumn: false};
        }
    }

    // Initially highlight the board at the origin
    HandleHighlighting(4, 4, arr);
    arr[3][3].locked=true;
    return arr;
}  
