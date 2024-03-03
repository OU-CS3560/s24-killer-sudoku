/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Generates a valid full sudoku board
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting } from "./Sudoku";

/**
 * @brief Initializes the board to be a 2d array, generates a board full of 
 *        data with SpaceButtonProperties, and highlights the origin to start.
 * @returns A 9x9 board
 */
export function initBoard(used: number): SpaceButtonProperties[][] {

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

    console.log("initBoard: Start");
    
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

    for (let i1: number = 1; i1 <= 9; i1++) { // Randomize the placement of each set of numbers
        let i2: number = rand(1,9);
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (Number(values[x][y]) === i1) {values[x][y] = i2.toString();} 
                else 
                if (Number(values[x][y]) === i2) {values[x][y] = i1.toString();}
            }
        }
    }
    console.log("initBoard: Randomization complete");

    // Initialization Loop, load all values onto the board's hidden data
    let arr: SpaceButtonProperties[][] = [];
    for (let x = 0; x < 9; x++) {
        arr[x] = []; // <-- Don't change unless better solution, need to fill the initial columns with a row vector.
        for (let y = 0; y < 9; y++) {
            arr[x][y] = {data: '', hiddenData: values[x][y], highlighted: 'space', locked: false};
        }
    }
    console.log("initBoard: Initialization complete");

    // Eventually have this value come from a UI element, instead of being defined here
    let difficulty: string = "Medium";

    // Also feel free to change around these difficulty values a bit
    // The number signifies how many tiles (out of 81) are shown at start
    const diffMap = new Map<string,number> ([
        ["Easy"    , 37],
        ["Medium"  , 31],
        ["Hard"    , 23],
        ["Expert"  , 17],
        ["K-Easy"  , 31],
        ["K-Medium", 25],
        ["K-Hard"  , 10],
        ["K-Expert", 0 ]
    ]);

    // for weird looking operator "??" look up "Nullish coalescing operator"
    // basically returns left value as long as it's not null or undefined, otherwise returns right
    const numShown: number = diffMap.get(difficulty) ?? 81; //81 is default in case something goes wrong

    console.log("initBoard: Difficulty: %s. numShown: %d ", difficulty, numShown);

    // Showing Tiles
    for (let i = 0; i < numShown; i++) {
        while (true) {
            let x: number = rand(0,8);
            let y: number = rand(0,8);
            if (arr[x][y].data === '') {
                arr[x][y].data = arr[x][y].hiddenData;
                arr[x][y].locked = true;
                break;
            }
            else{
                used++;
            }
        }
    }
    console.log("initBoard: Tile showing complete");

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
export function rand(a: number, b: number): number {
    return Math.floor(Math.random() * (b-a+1) + a);
};
