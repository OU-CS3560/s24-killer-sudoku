/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Generates a valid full sudoku board
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting, SaveBoardState } from "./Sudoku";
import { solve_gen, genBoardType, makeBoard, boardAdd, boardRem } from "./Solver";

/**
 * @brief Initializes the board to be a 2d array, generates a board full of 
 *        data with SpaceButtonProperties, and highlights the origin to start.
 * @param used (WIP)
 * @returns A 9x9 board
 */
export function initBoard(used: number): SpaceButtonProperties[][] {

    console.log("initBoard: Start");

    let iter: number = 0;

    const generate = (board: genBoardType): boolean => {
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

    let board: genBoardType = makeBoard();
    do {
        board = makeBoard();
        generate(board);
    } while (!isValid(board));

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
    initBoardBoldLines(arr);
    HandleHighlighting(4, 4, arr);
    SaveBoardState(arr);
    return arr;
}

function initBoardBoldLines(newBoard: SpaceButtonProperties[][]): SpaceButtonProperties[][]{
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
    
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            newBoard[i][j].mutableStatus = 'dashedBorder';
        }
    }

    // newBoard[2][1].mutableStatus ='dashedBorderRightOpen';
    // newBoard[2][1].topleftnumber = 4;
    // newBoard[3][1].mutableStatus ='dashedBorderLeftRightOpen';
    // newBoard[4][1].mutableStatus ='dashedBorderLeftRightOpen';
    // newBoard[5][1].mutableStatus ='dashedBorderLeftBottomOpen';
    // newBoard[5][2].mutableStatus ='dashedBorderTopBottomOpen';
    // newBoard[5][3].mutableStatus ='dashedBorderTopOpen'; 
    // newBoard[7][3].mutableStatus ='dashedBorderAllClosed'; 

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

//Extra stuff below:

//Convert num to str, with 0 becoming ' '
function toStr(input: number): string {
    return (input == 0) ? ' ' : input.toString();
}
//Convert str to num, with ' ' becoming 0
function toNum(input: string): number {
    return (input == ' ') ? 0 : Number(input);
}

//isValid function -> determines if board is valid (no overlaps)
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

//takes a note tile, turns it into randomized array of those available numbers
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
 * @param a lower limit
 * @param b upper limit
 * @returns random value between a & b
 */
function rand(a: number, b: number): number {
    return (Math.random() * (b-a+1) + a) >>0;
}