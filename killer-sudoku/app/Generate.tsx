/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Generates a valid full sudoku board
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting, SaveBoardState } from "./Sudoku";
import { genBoardType, makeBoard, isValid, solve_str as solve_gen, randomOptions, rand, boardAdd, boardRem } from "./Solver";
import { stringify } from "querystring";

/**
 * @brief Initializes the board to be a 2d array, generates a board full of 
 *        data with SpaceButtonProperties, and highlights the origin to start.
 * @param used (WIP)
 * @returns A 9x9 board
 */
export function initBoard(used: number): SpaceButtonProperties[][] {

    console.log("initBoard: Start");

    let iter: number = 0;
    let board: genBoardType = makeBoard();
    do {
        board = makeBoard();
        generate(board);
    } while (!isValid(board));

    function generate(board: genBoardType): boolean {
        if (iter++ > 50) {
            //if (debug) console.log("Iter Limit, Restart");
            iter = 0;
            return true;
        }
        
        //Calls solver & records all changes it made
        const changes: [number,number,number][] = solve_gen(board,2);
        if (board.state >= 0) {
            if (board.occ == 81) return true;
            //if (debug) printBoard(board,true);

            let x: number = 0, y: number = 0;
            do {
                x = rand(0,8);
                y = rand(0,8);
            } while (board.tile[x][y] != 0);

            //Look through every available option
            for (let val of randomOptions(board.note[x][y])) { 
                boardAdd(board,val,x,y);
                //if (debug) console.log(`Gen: ${val} @ [${x} ${y}]`);
                if (generate(board)) return true;
                //if (debug) console.log("Back");
                boardRem(board,val,x,y);
                //if (debug) printBoard(board,true)
            }
        }

        //If board is unsolvable, undo all solver changes & return false
        for (let ch of changes) { 
            boardRem(board,ch[0],ch[1],ch[2]);
        }
        board.state = 0;
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
    let shown: genBoardType = makeBoard(), temp: genBoardType = makeBoard();
    while (!isValid(temp)) {
        shown = makeBoard(); temp = makeBoard();
        for (let i = 0; i < numShown; i++) {
            while (true) {
                let x: number = rand(0,8);
                let y: number = rand(0,8);
                if (shown.tile[x][y] == 0) {
                    boardAdd(shown,board.tile[x][y],x,y);
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
        for (let x of [0,1,2,3,4,5,6,7,8]) {
            for (let y of [0,1,2,3,4,5,6,7,8]) {
                temp.tile[x][y] = shown.tile[x][y];
                for (let n of [1,2,3,4,5,6,7,8,9]) {
                    temp.note[x][y][n] = shown.note[x][y][n];
                }
            }
        }
        temp.occ = shown.occ; temp.state = shown.state;
        solve_gen(temp,2);
    }

    console.log("initBoard: Tile showing complete");

    // Initialization Loop, load all values onto the board's data
    let arr: SpaceButtonProperties[][] = [];
    for (let x = 0; x < 9; x++) {
        arr[x] = [];
        for (let y = 0; y < 9; y++) {
            arr[x][y] = {
                data: toStr(shown.tile[x][y]),
                hiddenData: toStr(board.tile[x][y]), 
                highlighted: 'space', 
                locked: (shown.tile[x][y] != 0), // <-- Lock the tile if it's not blank
                dataStatus: '', 
                savedData: toStr(shown.tile[x][y]), 
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

//solve function -> solves board & also determines if board is solvable with only one solution
//return 1: boolean true if it succeeded, false otherwise
//return 2: board after it's attempt at solving it
export function solve_sbp(boardSBP: SpaceButtonProperties[][]): [boolean, SpaceButtonProperties[][]] {
    
    let board: genBoardType = makeBoard();
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            const num = toNum(boardSBP[x][y].data);
            boardAdd(board,num,x,y);
        }
    }

    // TODO: Check for incorrect tiles & correct them

    // Uses the solve function in Solver.tsx
    solve_gen(board);

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            const num = toStr(board.tile[x][y]);
            boardSBP[x][y].data = num;
        }
    }
    
    return [isValid(board), boardSBP];
}

//Convert num to str, with 0 becoming ' '
function toStr(input: number): string {
    return (input == 0) ? ' ' : input.toString();
}
//Convert str to num, with ' ' becoming 0
function toNum(input: string): number {
    return (input == ' ') ? 0 : Number(input);
}
