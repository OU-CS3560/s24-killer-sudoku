/**
 * @file     Generate.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Generates a valid full sudoku board
 * @date     February 26, 2024
*/

import { SpaceButtonProperties, HandleHighlighting, SaveBoardState } from "./Sudoku";
import { solve, isAvailable, isValid } from "./Solver";

/**
 * @brief Initializes the board to be a 2d array, generates a board full of 
 *        data with SpaceButtonProperties, and highlights the origin to start.
 * @param used (WIP)
 * @returns A 9x9 board
 */
export function initBoard(used: number): SpaceButtonProperties[][] {

    console.log("initBoard: Start");

    let board: string[][] = [];

    let iter: number = 0;
    do {
        board = [];
        for (let a = 0; a < 9; a++) {
            board.push([]);
            for (let b = 0; b < 9; b++) {
                board[a].push('');
            }
        }
        gen(board, 0);
    } while (!isValid(board));

    function gen(board: string[][], num: number): boolean {
        if (iter++ > 1000) {iter = 0; return true;}

        if (num > 54) {
            let tboard = board;
            if (solve(tboard)) {board = tboard; return true;}
        }
    
        let x: number = num % 9;
        let y: number = (num / 9) >>0;
            
        let options: number[] = [1,2,3,4,5,6,7,8,9];
        shuffleArray(options);
    
        for (let o of options) {
            if (!isAvailable(board,o,x,y)) continue;
            board[x][y] = o.toString();
            //printBoard(board);
            if (gen(board, num+1)) return true;
        }
        board[x][y] = '';
        return false;
    }

    console.log("initBoard: Randomization complete");

    // Initialization Loop, load all values onto the board's hidden data
    let arr: SpaceButtonProperties[][] = [];
    for (let x = 0; x < 9; x++) {
        arr[x] = []; // <-- Don't change unless better solution, need to fill the initial columns with a row vector.
        for (let y = 0; y < 9; y++) {
            arr[x][y] = {data: '', hiddenData: board[x][y], highlighted: 'space', locked: false, dataStatus:'', savedData: '', savedHighlight: 'space'};
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
                arr[x][y].savedData = arr[x][y].data;
                arr[x][y].locked = true;
                break;
            }
            else{
                /**
                 * @todo FIX THIS SO THAT USED GETS INCREMENTED CORRECTLY THROUGHOUT RUNTIME
                used++;
                 */
            }
        }
    }
    // initBoardBoldLines(arr);
    console.log("initBoard: Tile showing complete");

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
export function Solve(board: SpaceButtonProperties[][]): [boolean, SpaceButtonProperties[][]] {
    
    function isValInThisRowColOr3x3(val: number, row: number, col: number): boolean {
        for (let i = 0; i < 9; i++) {
            if (i != row && board[i][col].data == val.toString()) {
                //console.log(`row ${i}`);
                return true;
            }
            if (i != col && board[row][i].data == val.toString()) {
                //console.log(`col ${i}`); 
                return true;
            }
            let a: number = i % 3 + Math.floor(row/3)*3; 
            let b: number = Math.floor(i/3) + Math.floor(col/3)*3;
            if (a != row && b != col && board[a][b].data == val.toString()) {
                //console.log(`3x3 ${i}`);
                return true;
            }
        }
        return false;
    }

    let notes: boolean[][][] = [];
    for (let x = 0; x < 9; x++) {
        notes[x] = [];
        for (let y = 0; y < 9; y++) {
            if (board[x][y].data != '') continue;
            notes[x][y] = [];
        }
    }

    for (let i1: number = 1; i1 <= 9; i1++) { // Randomize the placement of each set of numbers
        let i2: number = rand(1,9);
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (board[x][y].data != '') continue;
                let sum: number = 0;
                for (let n: number = 1; n <= 9; n++) {
                    notes[x][y][n] = !isValInThisRowColOr3x3(n,x,y);
                    //console.log(`c: ${x} ${y} ${n}, b: ${notes[x][y][n]}`)
                    sum += +notes[x][y][n];
                }

                //Technique 1: if theres only one option, put it in
                if (sum == 1) { //if there is one boolean true
                    for (let n: number = 1; n <= 9; n++) {
                        if (!notes[x][y][n]) continue;
                        notes[x][y][n] = false;
                        board[x][y].data = n.toString();
                        progress = true;
                    }
                } 
            }
        }
        //console.log("lol");
    }
    
    let solved: boolean = true;
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            if (board[x][y].data == '') solved = false;
        }
    }
    
    return [solved, board];
}





/*isValid function -> determines if board is valid (no overlaps)
function isValid(board: SpaceButtonProperties[][]): boolean {
    //1: Check Rows & Cols
    for (let a = 0; a < 9; a++) {
        
    }
}*/

/* Soon-to-be Tomb of the old generation algorithm (pretty fast, but isn't random enough)



*/