/**
 * @file     Solver.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Function to solve a board / determine if it's solvable
 * @date     March 8, 2024
*/

// TODO: Re-do Comments and such

/**
 * @brief takes input board & tries to solve it
 * @param board input board of string[][] trying to be solved
 * @returns tuple of a boolean (did it succeed or not) & the resulting board, completed or not
 */
export function solve_str(input: string[][]): [boolean, string[][]] {
    const board: string[][] = copyBoard(input);

    const notes: boolean[][][] = [];
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

    let progress: boolean = true
    while (progress) {
        progress = false;

        // Updating Notes
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (board[x][y] != '') continue;
                for (let n: number = 1; n <= 9; n++) {
                    notes[x][y][n] = isAvailable(board,n.toString(),x,y);
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

//Checks if given value is in this board's row, column, or 3x3
export function isAvailable(input: string[][], val: string, row: number, col: number): boolean {
    const board: string[][] = copyBoard(input);
    for (let i = 0; i < 9; i++) {
        if (i != row && board[i][col] == val) {
            //console.log(`row ${i}`);
            return false;
        }
        if (i != col && board[row][i] == val) {
            //console.log(`col ${i}`);
            return false;
        }
        const a: number = (i % 3) + (row/3 >>0) *3;
        if (a == row) continue;
        const b: number = (i/3 >>0) + (col/3 >>0) *3;
        if (b != col && board[a][b] == val) {
            //console.log(`3x3 ${i}`);
            return false;
        }
    }
    return true;
}

//isValid function -> determines if board is valid (no overlaps)
export function isValid(input: string[][]): boolean {
    const board: string[][] = copyBoard(input);
    for (let d1 = 0; d1 < 9; d1++) {
        const nums1: boolean[] = [];
        const nums2: boolean[] = [];
        const nums3: boolean[] = [];
        for (let d2 = 0; d2 < 9; d2++) {
            const tile1 = toNum(board[d1][d2]);
            if (nums1[tile1] || tile1 == 0) return false;
            nums1[tile1] = true;
            const tile2 = toNum(board[d2][d1]);
            if (nums2[tile2] || tile2 == 0) return false;
            nums2[tile2] = true;
            const tile3 = toNum( board
                [(d2 % 3) + (d1/3 >>0)*3]
                [(d2/3 >>0) + (d1/3 >>0)*3]
            );
            if (nums3[tile3] || tile3 == 0) return false;
            nums3[tile3] = true;
        }
    }
    return true;
}

//Converts character value to number, specifically single digit values
export function toNum(input: string): number {
    switch (input) {
        case '1': return 1;
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        case '5': return 5;
        case '6': return 6;
        case '7': return 7;
        case '8': return 8;
        case '9': return 9;
        default : return 0;
    }
}

// Creates 9x9 blank board
export function makeBoard(): string[][] {
    return [
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','','']
    ];
}

// Copies a board by value
export function copyBoard(input: string[][]): string[][] {
    const result: string[][] = [];
    for (let x = 0; x < 9; x++) {
        result[x] = [];
        for (let y = 0; y < 9; y++) {
            result[x][y] = input[x][y];
        }
    }
    return result;
}
