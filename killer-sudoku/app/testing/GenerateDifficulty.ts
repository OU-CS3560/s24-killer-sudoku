/**
 * @file     Generate.ts
 * @author   Nicholas Adkins <na761422@ohio.edu>
 * @brief    Generates a valid full sudoku board, both with hidden & visible values
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting, SaveBoardState } from "../SudokuFuncs";
import { solve_gen, genBoard } from "../Solver";
import { kTile, genKiller, undef_kArr, doKillerUIStuff } from "../GenKiller";

/**
 * @brief Initializes the board to be a 2d array, generates a board full of 
 *        data with SpaceButtonProperties, and highlights the origin to start.
 * @param {boolean} killer (WIP)
 * @param {number} used (WIP?)
 * @returns {SpaceButtonProperties[][]} A 9x9 board, both with visible & hidden values on every tile
 */
export function initBoard(killer: boolean, used: number, difficulty: string): SpaceButtonProperties[][] {

    console.log("initBoard: Start");

    let iter: number = 0;

    const generate = (board: genBoard): boolean => {
        if (iter++ > 50) {iter = 0; return true;}
        
        //Calls solver & records all changes it made
        const numChanges: number = solve_gen(board);
        if (board.state) {
            if (board.occ == 81) return true;

            let x: number = 0, y: number = 0;
            do {
                x = rand(0,8); y = rand(0,8);
            } while (board.tile[x][y] != 0);

            //Look through every available option
            for (let val of randomOptions(board.note[x][y])) { 
                board.add(val,x,y);
                if (generate(board)) return true;
                board.undo();
            }
        }

        //If board is unsolvable, undo all solver changes & return false
        for (let i = 0; i < numChanges; i++) board.undo();
        board.state = true;
        return false;
    }

    let board = new genBoard;
    do {
        board = new genBoard;
        generate(board);
    } while (!board.isValid());

    console.log("initBoard: Randomization complete");

    let kBoard: kTile[][] = undef_kArr();
    if (killer) {
        kBoard = genKiller(board.tile);
        console.log("initBoard: Killer Generation complete");
    }

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

    console.log(`initBoard: Difficulty: ${difficulty}. numShown: ${numShown}`);

    // TODO: FIX "used++;" SO THAT USED GETS INCREMENTED CORRECTLY THROUGHOUT RUNTIME
    // since i reworked everything i just moved this out here - Nick

    // Showing Tiles
    let shown = new genBoard;
    let copy = new genBoard;
    // for (let copy = new genBoard; !copy.isValid(); solve_gen(copy,kBoard)) {
    //     shown = new genBoard; copy = new genBoard;
        for (let i = 0; i < numShown; i++) {
            let x: number = 0, y: number = 0;
            do {
                x = rand(0,8); y = rand(0,8);
            } while (shown.tile[x][y] != 0)
            shown.add(board.tile[x][y],x,y);
            copy.add(board.tile[x][y],x,y);
        }
    // }

    console.log("initBoard: Tile showing complete");

    // Initialization Loop, load all values onto the board's data
    let arr: SpaceButtonProperties[][] = [];
    for (let x = 0; x < 9; x++) {
        arr[x] = [];
        for (let y = 0; y < 9; y++) {
            const tile = toStr(shown.tile[x][y]);
            const hidd = toStr(board.tile[x][y]);
            arr[x][y] = {
                data: tile,
                highlighted: 'space',
                savedData: tile,
                hiddenData: hidd,
                fixedStatus: '',
                mutableStatus: 'dashedBorder1111',
                locked: (tile != ''), // <-- Lock the tile if it's not blank
                previousHighlight: 'space',
                marked: false,
                topLeftNumber: 0,
            };
        }
    }

    console.log("initBoard: Initialization complete");

    if (killer) {
        doKillerUIStuff(kBoard,arr);
        console.log("initBoard: Killer UI elements complete");
    }

    // Initially highlight the board at the origin
    // initBoardBoldLines(arr);
    // HandleHighlighting(4, 4, arr, false);
    SaveBoardState(arr);
    return arr;
}

function initBoardBoldLines(newBoard: SpaceButtonProperties[][]): void {
    /*Init fixed status for the bolded border outlines */
    for (let i = 0; i < 9; i++){
        newBoard[i][0].fixedStatus='Top';
        newBoard[0][i].fixedStatus='Left';        

        newBoard[i][3].fixedStatus='Top';
        newBoard[3][i].fixedStatus='Left';

        newBoard[i][6].fixedStatus='Top';
        newBoard[6][i].fixedStatus='Left';

        newBoard[i][8].fixedStatus='Bottom';
        newBoard[8][i].fixedStatus='Right';
    }
    for (let i = 0; i < 9; i += 3){
        for (let j = 0; j < 9; j += 3){
            newBoard[i][j].fixedStatus='TopLeft'
        }
    }
    for (let i = 0; i <= 6; i += 3){
        newBoard[i][8].fixedStatus='BottomLeft';
        newBoard[8][i].fixedStatus='TopRight';
    }
    newBoard[8][8].fixedStatus='BottomRight';
}

/**
 * @brief solves the board: copies data values onto a genBoardType, solves that, then converts back
 * @param {SpaceButtonProperties[][]} boardSBP input board to be solved
 * @return {void} None (input is passed by reference)
 */
export function solve_sbp(boardSBP: SpaceButtonProperties[][]): void {
    let board = new genBoard;
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            const tile = boardSBP[x][y];
            //also fixes incorrect tiles so solver works properly
            if (tile.data == tile.hiddenData) {
                board.add(toNum(tile.data),x,y);
            }
        }
    }
    solve_gen(board); // Uses the solve function in Solver.tsx
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            boardSBP[x][y].data = toStr(board.tile[x][y]);
        }
    }
}

//Extra stuff below:

/**
 * @brief Tile value conversion: genBoardType  -> SBP[][]
 * @param {number} input input number
 * @returns {string} input as a string, with 0 becoming ''
 */
function toStr(input: number): string {
    return (input == 0) ? '' : input.toString();
}

/**
 * @brief Tile value conversion: SBP[][] -> genBoardType
 * @param {string} input input string
 * @returns {number} input as a number, with '' becoming 0
 */
function toNum(input: string): number {
    return (input == '') ? 0 : Number(input);
}

/**
 * @brief takes a note tile, turns it into randomized array of those available numbers
 * @param {boolean[]} tile notes of a tile
 * @returns {number[]} random array of available number options for this tile
 */
function randomOptions(tile: boolean[]): number[] {
    let arr: number[] = [];
    for (let i: number = 1; i <= 9; i++) {
        if (tile[i]) arr.push(i);
    }
    const sz = arr.length;
    for (let i = 0; i < sz; i++) {
        let j = rand(0,sz-1);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

/**
 * @brief Random number generator, in range (a,b) inclusive
 * @param {number} a lower limit
 * @param {number} b upper limit
 * @returns {number} random value between a & b
 */
export function rand(a: number, b: number): number {
    return (Math.random() * (b-a+1) + a) >>0;
}