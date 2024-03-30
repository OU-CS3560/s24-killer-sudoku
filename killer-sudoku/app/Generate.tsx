/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Generates a valid full sudoku board
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting, SaveBoardState } from "./Sudoku";
import { genBoardType, makeBoard, isValid, solve_str as solve_gen, randomOptions, rand, boardAdd, boardRem } from "./Solver";

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
        if (iter++ > 50) {iter = 0; return true;}
        
        //Calls solver & records all changes it made
        const changes: [number,number,number][] = solve_gen(board,2);
        if (board.state >= 0) {
            if (board.occ == 81) return true;

            let x: number = 0, y: number = 0;
            do {
                x = rand(0,8);
                y = rand(0,8);
            } while (board.tile[x][y] != 0);

            //Look through every available option
            for (let val of randomOptions(board.note[x][y])) { 
                boardAdd(board,val,x,y);
                if (generate(board)) return true;
                boardRem(board,val,x,y);
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
            let x: number = 0, y: number = 0;
            do {
                x = rand(0,8); y = rand(0,8);
            } while (shown.tile[x][y] != 0)
            boardAdd(shown,board.tile[x][y],x,y);
            /**
             * @todo FIX THIS SO THAT USED GETS INCREMENTED CORRECTLY THROUGHOUT RUNTIME
            used++;
            * i changed everything surrounding this code here, just FYI - Nick
            */
        }
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                temp.tile[x][y] = shown.tile[x][y];
                for (let n = 1; n <= 9; n++) {
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
            const tile = toStr(shown.tile[x][y]);
            const hidd = toStr(board.tile[x][y]);
            arr[x][y] = {
                data: tile,
                hiddenData: hidd, 
                highlighted: 'space', 
                locked: (tile != ' '), // <-- Lock the tile if it's not blank
                dataStatus: '', 
                savedData: tile, 
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
            const tile = boardSBP[x][y];
            const num = (tile.data == '' || tile.data == tile.hiddenData) ? tile.data : tile.hiddenData;
            boardAdd(board,toNum(num),x,y);
        }
    }

    solve_gen(board,2); // Uses the solve function in Solver.tsx

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
