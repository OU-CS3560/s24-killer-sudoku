/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Generates a valid full sudoku board
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting, SaveBoardState } from "./Sudoku";
import { solve_str, isAvailable, isValid, makeBoard, copyBoard } from "./Solver";

/**
 * @brief Initializes the board to be a 2d array, generates a board full of 
 *        data with SpaceButtonProperties, and highlights the origin to start.
 * @param used (WIP)
 * @returns A 9x9 board
 */
export function initBoard(used: number): SpaceButtonProperties[][] {

    console.log("initBoard: Start");

    let board: string[][] = makeBoard();
    generate(board,0);

    function generate(input: string[][], filled: number): boolean {
        let genBoard: string[][] = copyBoard(input);
        
        if (filled > 20) { // Ran tests, and 20 is best number for performance for some reason
            let solved: boolean = false;
            ([solved, genBoard] = solve_str(genBoard));
            if (solved) {board = copyBoard(genBoard); return true;}
        }

        let x: number = 0, y: number = 0;
        do {
            x = rand(0,8);
            y = rand(0,8);
        } while (genBoard[x][y] != '');

        for (let o of ['1','2','3','4','5','6','7','8','9']) {
            if (!isAvailable(genBoard,o,x,y)) continue;
            genBoard[x][y] = o;
            if (generate(genBoard,filled+1)) return true;
        }
        return false;
    }

    console.log("initBoard: Randomization complete");

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
    let shown: string[][] = [];
    for (let solvable: boolean = false; !solvable; solvable = solve_str(shown)[0]) {
        shown = makeBoard();
        for (let i = 0; i < numShown; i++) {
            while (true) {
                let x: number = rand(0,8);
                let y: number = rand(0,8);
                if (shown[x][y] == '') {
                    shown[x][y] = board[x][y];
                    break;
                }
                else {
                    /**
                     * @todo FIX THIS SO THAT USED GETS INCREMENTED CORRECTLY THROUGHOUT RUNTIME
                    used++;
                    * i changed everything surrounding this code here, just FYI - Nick
                    */
                }
            }
        }
    }

    console.log("initBoard: Tile showing complete");

    // Initialization Loop, load all values onto the board's data
    let arr: SpaceButtonProperties[][] = [];
    for (let x = 0; x < 9; x++) {
        arr[x] = [];
        for (let y = 0; y < 9; y++) {
            arr[x][y] = {
                data: shown[x][y], 
                hiddenData: board[x][y], 
                highlighted: 'space', 
                locked: (shown[x][y] != ''), // <-- Lock the tile if it's not blank
                dataStatus: '', 
                savedData: shown[x][y], 
                savedHighlight: 'space'
            };
        }
    }

    console.log("initBoard: Initialization complete");

    // initBoardBoldLines(arr);

    // Initially highlight the board at the origin
    HandleHighlighting(4, 4, arr);
    SaveBoardState(arr);
    return arr;
}

//shuffles an array of numbers
function shuffleArray(arr: number[]): void {
    let end = arr.length-1;
    for (let i = 0; i < end; i++) {
        let j: number = rand(0, end);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

function initBoardBoldLines(newBoard: SpaceButtonProperties[][]): SpaceButtonProperties[][]{
    for (let i = 0; i < 9; i++){
        newBoard[i][0].dataStatus='top';
        newBoard[0][i].dataStatus='left';

        newBoard[i][2].dataStatus='top';
        newBoard[2][i].dataStatus='left';

        newBoard[i][5].dataStatus='bottom';
        newBoard[5][i].dataStatus='right';

        newBoard[i][8].dataStatus='bottom';
        newBoard[8][i].dataStatus='right';
    }
    return newBoard;
}

/**
 * @brief Random number generator, in range (a,b) inclusive
 * @param a lower limit
 * @param b upper limit
 * @returns random value between a & b
 */
export function rand(a: number, b: number): number {
    return (Math.random() * (b-a+1) + a) >>0;
};

//solve function -> solves board & also determines if board is solvable with only one solution
//return 1: boolean true if it succeeded, false otherwise
//return 2: board after it's attempt at solving it
export function solve_sbp(boardSBP: SpaceButtonProperties[][]): [boolean, SpaceButtonProperties[][]] {
    
    let boardSTR: string[][] = [];
    for (let x = 0; x < 9; x++) {
        boardSTR[x] = [];
        for (let y = 0; y < 9; y++) {
            boardSTR[x][y] = boardSBP[x][y].data;
        }
    }

    // Uses the reworked solve function in Solver.tsx
    // Gonna make all of this look better later
    let solved: boolean = false;
    ([solved, boardSTR] = solve_str(boardSTR));
    // Also forgot arrays always return by reference in typescript, so i reworked that function as such

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            boardSBP[x][y].data = boardSTR[x][y];
        }
    }
    
    return [solved, boardSBP];
}



/* Tomb of the old generation algorithm (pretty fast, but isn't random enough)

    function swapRow(r1: number, r2: number): void {
        let temp: string[] = values[r1];
        values[r1] = values[r2];
        values[r2] = temp;
    }
    
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
        let row: number = (i/3 >>0)*3 + rand(0,2);
        swapRow(i,row);
        let col: number = (i/3 >>0)*3 + rand(0,2);
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
*/