/**
 * @file     Solver.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Function to solve a board / determine if it's solvable
 * @date     March 8, 2024
*/

//solve function -> solves board & also determines if board is solvable with only one solution
//return 1: boolean true if it succeeded, false otherwise
//return 2: board after it's attempt at solving it
export function solve(board: string[][]): [boolean, string[][]] {

    let notes: boolean[][][] = [];
    for (let x = 0; x < 9; x++) {
        notes[x] = [];
        for (let y = 0; y < 9; y++) {
            if (board[x][y] != '') continue;
            notes[x][y] = [];
            for (let n: number = 1; n <= 9; n++) {
                notes[x][y][n] = false;
            }
        }
    }

    for (let progress: boolean = true; progress == true;) {
        progress = false;

        // Updating Notes
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (board[x][y] != '') continue;
                for (let n: number = 1; n <= 9; n++) {
                    notes[x][y][n] = !isValInThisRowColOr3x3(board,n,x,y);
                    //console.log(`c: ${x} ${y} ${n}, b: ${notes[x][y][n]}`)
                }
            }
        }

        // Method 1: if theres only one note in a tile, put it in
        for (let x = 0; x < 9; x++) { 
            for (let y = 0; y < 9; y++) {
                if (board[x][y] != '') continue;
                let val: number = -1;
                for (let n: number = 1; n <= 9; n++) {
                    if (notes[x][y][n]) {
                        val = (val == -1) ? n : -2;
                    }
                }
                if (val >= 0) { //if there is one boolean true
                    //console.log(`val: ${val}`);
                    board[x][y] = val.toString();
                    progress = true;
                }
            }
        }

        // Method 2: if theres only one note of a type in a row/col/3x3, put it in
        for (let d1 = 0; d1 < 9; d1++) { 
            for (let n: number = 1; n <= 9; n++) {
                let valR: number = -1;
                for (let d2 = 0; d2 < 9; d2++) {
                    if (board[d1][d2] == n.toString()) {
                        valR = -3; break;
                    }
                    if (board[d1][d2] == '' && notes[d1][d2][n]) {
                        valR = (valR == -1) ? d2 : -2;
                    }
                }
                if (valR >= 0) { //if there is one boolean true
                    //console.log(`valR: ${valR}`);
                    board[d1][valR] = n.toString();
                    progress = true;
                }
                let valC: number = -1;
                for (let d2 = 0; d2 < 9; d2++) {
                    if (board[d2][d1] == n.toString()) {
                        valC = -3; break;
                    }
                    if (board[d2][d1] == '' && notes[d2][d1][n]) {
                        valC = (valC == -1) ? d2 : -2;
                    }
                }
                if (valC >= 0) { //if there is one boolean true
                    //console.log(`valC: ${valC}`);
                    board[valC][d1] = n.toString();
                    progress = true;
                }
            }
        }
    }
    
    let solved: boolean = true;
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            if (board[x][y] == '') solved = false;
        }
    }
    return [solved, board];
}

//Helper function used in solve(), though may be applicable elsewhere
function isValInThisRowColOr3x3(board: string[][], val: number, row: number, col: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (i != row && board[i][col] == val.toString()) {
            //console.log(`row ${i}`);
            return true;
        }
        if (i != col && board[row][i] == val.toString()) {
            //console.log(`col ${i}`);
            return true;
        }
        let a: number = i % 3 + (row/3 >>0) *3; 
        if (a == row) continue;
        let b: number = (i/3 >>0) + (col/3 >>0) *3;
        if (b != col && board[a][b] == val.toString()) {
            //console.log(`3x3 ${i}`);
            return true;
        }
    }
    return false;
}

//TODO: maybe work on this if i need it
/*isValid function -> determines if board is valid (no overlaps)
function isValid(board: SpaceButtonProperties[][]): boolean {
    //1: Check Rows & Cols
    for (let a = 0; a < 9; a++) {
        
    }
}*/