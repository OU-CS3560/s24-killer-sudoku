/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins <na761422@ohio.edu>
 * @brief    Generates a valid full sudoku board, both with hidden & visible values
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting, SaveBoardState } from "./Sudoku";
import { solve_gen, genBoardType, makeBoard, boardAdd, boardRem } from "./Solver";
import { kTile, genKiller, killerTopLeftVals, onBoard } from "./GenKiller";

//Set true to override/force turn on killer sudoku generation, false for default behavior
const KillerOverride: boolean = false;

/**
 * @brief Initializes the board to be a 2d array, generates a board full of 
 *        data with SpaceButtonProperties, and highlights the origin to start.
 * @param {number} used (WIP?)
 * @returns {SpaceButtonProperties[][]} A 9x9 board, both with visible & hidden values on every tile
 */
export function initBoard(killer: boolean, used: number): SpaceButtonProperties[][] {

    console.log("initBoard: Start");

    let iter: number = 0;

    const generate = (board: genBoardType): boolean => {
        if (iter++ > 50) {iter = 0; return true;}
        
        //Calls solver & records all changes it made
        const changes: [number,number][] = solve_gen(board,2);
        if (board.state) {
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
                boardRem(board,x,y);
            }
        }

        //If board is unsolvable, undo all solver changes & return false
        for (let ch of changes) boardRem(board,ch[0],ch[1]);
        board.state = true;
        return false;
    }

    let board: genBoardType = makeBoard();
    do {
        board = makeBoard();
        generate(board);
    } while (!isValid(board));

    console.log("initBoard: Randomization complete");

    // Eventually have this value come from a UI element, instead of being defined here
    const difficulty: string = "Medium";

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

    let kBoard: kTile[][] = [];
    if (killer || KillerOverride) kBoard = genKiller(board.tile);

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
                mutableStatus: '',
                locked: (tile != ''), // <-- Lock the tile if it's not blank
                previousHighlight: 'space',
                marked: false,
                topleftnumber: 0,
            };
        }
    }

    console.log("initBoard: Initialization complete");

    // Initially highlight the board at the origin
    initBoardBoldLines(arr, kBoard);
    HandleHighlighting(4, 4, arr);
    SaveBoardState(arr);
    return arr;
}

function initBoardBoldLines(newBoard: SpaceButtonProperties[][], kBoard: kTile[][]): void {
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

    /* START OF MUTABLE BORDER ALGORITHM 

    // random number hash for identifier, boolean for visited
    let mapping = new Map<number, boolean>();

    switch(percentage){

        //no default case because its defined in a range of 1-100
    }
    */

    if (kBoard.length == 0) { //if no killer groups, ignore dashed borders & return
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                newBoard[x][y].mutableStatus = 'dashedBorder1111';
            }
        }
        return;
    }

    for (let val of killerTopLeftVals(kBoard)) {
        newBoard[val[0]][val[1]].topleftnumber = val[2].sum;
    }

    // Holy Sacred Comment: Do NOT remove this comment under ANY circumstances, otherwise will break group outlines
    // \/                     \/
    //newBoard[0][0].mutableStatus = 'dashedBorder0000';
    // /\                     /\

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let neighbors: string[] = [];
            const thisSym: string = kBoard[x][y].symbol;
            for (let opt of [[x,y-1],[x+1,y],[x,y+1],[x-1,y]]) {
                const x0 = opt[0], y0 = opt[1];
                neighbors.push((onBoard(x0,y0) && kBoard[x0][y0].symbol == thisSym) ? '1' : '0');
            }
            newBoard[x][y].mutableStatus = `dashedBorder${neighbors.join('')}`;
        }
    }
}

/**
 * @brief solves the board: copies data values onto a genBoardType, solves that, then converts back
 * @param {SpaceButtonProperties[][]} boardSBP input board to be solved
 * @return {void} None (input is passed by reference)
 */
export function solve_sbp(boardSBP: SpaceButtonProperties[][]): void {
    let board: genBoardType = makeBoard();
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            const tile = boardSBP[x][y];
            //also fixes incorrect tiles so solver works properly
            if (tile.data == tile.hiddenData) {
                boardAdd(board,toNum(tile.data),x,y)
            }
        }
    }
    solve_gen(board,2); // Uses the solve function in Solver.tsx
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
 * @brief determines if the given board is full & is a valid sudoku board
 * @param {genBoardType} board input board
 * @returns {boolean} true if full & valid/solved, false otherwise
 */
function isValid(board: genBoardType): boolean {
    for (let d1 = 0; d1 < 9; d1++) {
        const a = (d1%3)*3, b = (d1/3>>0)*3;
        let nums1: boolean[] = [];
        let nums2: boolean[] = [];
        let nums3: boolean[] = [];
        for (let d2 = 0; d2 < 9; d2++) {
            const tile1 = board.tile[d1][d2];
            if (nums1[tile1] || tile1 == 0) return false;
            nums1[tile1] = true;
            const tile2 = board.tile[d2][d1];
            if (nums2[tile2] || tile2 == 0) return false;
            nums2[tile2] = true;
            const tile3 = board.tile[a+(d2%3)][b+(d2/3>>0)];
            if (nums3[tile3] || tile3 == 0) return false;
            nums3[tile3] = true;
        }
    }
    return true;
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