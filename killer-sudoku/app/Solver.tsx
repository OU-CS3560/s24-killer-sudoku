/**
 * @file     Solver.tsx
 * @author   Nicholas Adkins (na761422@ohio.edu)
 * @brief    Function to solve a board / determine if it's solvable
 * @date     March 8, 2024
*/

// TODO: Re-do Comments and such

/**
 * @brief takes input board & tries to solve it
 * @param board TODO
 * @returns TODO
 */
export function solve_str(board: genBoardType, opt: number = 0, debug: boolean = false): [number,number,number][] {
    let changes: [number,number,number][] = [];
    let tiles: number[][] = board.tile, notes: boolean[][][] = board.note;

    for (let progress: boolean = true; progress == true;) {
        progress = false;

        const success = (val: number, x: number, y: number, op?: number): void => {
            progress = true; 
            /*if (debug) {
                const message: string = `Sol: ${val} @ [${x} ${y}]`;
                switch(op) {
                    case 10: console.log(`${message}, Bec: M1`); break;
                    case 20: console.log(`${message}, Bec: M2-R`); break;
                    case 21: console.log(`${message}, Bec: M2-C`); break;
                    default: console.log(`${message}, Bec: ERR`); break;
                }
            }*/
            changes.push([val,x,y]);
            boardAdd(board,val,x,y);
        }

        //eliminate all notes in this row
        const clearRow = (row: number, val: number): void => {
            for (let y = 0; y < 9; y++) {
                notes[row][y][val] = false;
            }
        }
        //eliminate all notes in this col
        const clearCol = (col: number, val: number): void => {
            for (let x = 0; x < 9; x++) {
                notes[x][col][val] = false;
            }
        }

        // Method 1: if theres only one note in a tile, put it in
        if (true) { //opt == 0 || opt >= 1 -> true
        for (let x = 0; x < 9; x++) { 
            for (let y = 0; y < 9; y++) {
                if (tiles[x][y] != 0) continue;
                let val: number = -1;
                for (let n: number = 1; n <= 9; n++) {
                    if (notes[x][y][n]) {
                        val = (val == -1) ? n : -2;
                    }
                }
                if (val >= 0) { //if there is one boolean true
                    success(val,x,y,10);
                }
                if (val == -1) {
                    //if (debug) console.log(`Nop: @ [${x} ${y}]`);
                    board.state = -1;
                    return changes;
                }
            }
        }}

        // Method 2: if theres only one note of a type in a row/col, put it in
        if (opt == 0 || opt >= 2) {
        for (let d1 = 0; d1 < 9; d1++) {
            for (let n: number = 1; n <= 9; n++) {
                let valR: number = -1;
                for (let d2 = 0; d2 < 9; d2++) {
                    if (tiles[d1][d2] == n) {
                        valR = -3; break;
                    }
                    if (tiles[d1][d2] == 0 && notes[d1][d2][n]) {
                        valR = (valR == -1) ? d2 : -2;
                    }
                }
                if (valR >= 0) { //if there is one boolean true
                    success(n,d1,valR,20);
                }
                let valC: number = -1;
                for (let d2 = 0; d2 < 9; d2++) {
                    if (tiles[d2][d1] == n) {
                        valC = -3; break;
                    }
                    if (tiles[d2][d1] == 0 && notes[d2][d1][n]) {
                        valC = (valC == -1) ? d2 : -2;
                    }
                }
                if (valC >= 0) { //if there is one boolean true
                    success(n,valC,d1,21);
                }
            }
        }}

        // Method 3: if one note exists only in two/three tiles in a 3x3, and
        // those are in same row/col, then remove all others in that row/col
        if (opt == 0 || opt >= 3) {
            //1: Check all tiles in a 3x3 for a given note
            //2: Check if they're all in same row or col
            //3: If so x out all others in that row/col, else break
            for (let n: number = 1; n <= 9; n++) {
                for (let x = 0; x < 9; x++) {
                    let arr: [number,number][] = [];
                    for (let y = 0; y < 9; y++) {
                        const a = (y % 3)+(x % 3)*3, b = (y/3 >>0)+(x/3 >>0)*3;
                        if (tiles[a][b] == n) {arr = []; break;}
                        if (tiles[a][b] == 0 && notes[a][b][n]) arr.push([a,b]);
                    }
                    if (arr.length == 2) {
                        // if same 'a' val
                        if (arr[0][0] == arr[1][0]) {
                            clearRow(arr[0][0],n);
                        }
                        // if same 'b' val
                        if (arr[0][1] == arr[1][1]) {
                            clearCol(arr[0][1],n);
                        }
                    }
                    if (arr.length == 3) {
                        // if same 'a' val
                        if (arr[0][0] == arr[1][0] && arr[1][0] == (arr[2])[0]) {
                            clearRow(arr[0][0],n); 
                        }
                        // if same 'b' val
                        if (arr[0][1] == arr[1][1] && arr[1][1] == (arr[2])[1]) {
                            clearCol(arr[0][1],n);
                        }
                    }
                }
            }
        }

        // Method 4: if two types of notes form a pair, then remove all other
        //  notes from those tiles & those notes from that 3x3
        //if (opt == 0 || opt >= 4) {}

        // Method 5: idk how else to describe it: its the last one in this link
        //  https://www.conceptispuzzles.com/index.aspx?uri=puzzle/sudoku/techniques
        //if (opt == 0 || opt >= 5) {}

    }
    return changes;
}

//Extra stuff below:

export type genBoardType = {
    tile: number[][], note: boolean[][][], occ: number, state: number
};

export function allTrue(): boolean[] {
    return [true,true,true,true,true,true,true,true,true,true];
}
export function allFalse(): boolean[] {
    return [false,false,false,false,false,false,false,false,false,false];
}

//kinda obtuse, but it works
export function makeBoard(): genBoardType {
    const bl = allTrue;
    return {
        tile: [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]],
        note: [
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()]],
        occ: 0, state: 0
    };
}

export function boardAdd(board: genBoardType, val: number, x: number, y: number): void {
    board.tile[x][y] = val;
    board.occ++;
    const a = (x/3 >>0)*3, b = (y/3 >>0)*3;
    for (let i = 0; i < 9; i++) {
        board.note[i][y][val] = false; //each in row
        board.note[x][i][val] = false; //each in col
        board.note[a+(i%3)][b+(i/3>>0)][val] = false; //each in 3x3
        board.note[x][y][i+1] = false; //each in this tile
    }
}

export function boardRem(board: genBoardType, val: number, x: number, y: number): void {
    board.tile[x][y] = 0;
    board.occ--;
    const a = (x/3 >>0)*3, b = (y/3 >>0)*3;
    for (let i = 0; i < 9; i++) {
        if (board.tile[i][y] == 0) board.note[i][y][val] = reCalcNote(val,i,y); //each in row
        if (board.tile[x][i] == 0) board.note[x][i][val] = reCalcNote(val,x,i); //each in col
        const c = a+(i%3), d = b+(i/3>>0);
        if (board.tile[c][d] == 0) board.note[c][d][val] = reCalcNote(val,c,d); //each in 3x3
        board.note[x][y][i+1] = reCalcNote(i+1,x,y); //each in this tile
    }
    
    function reCalcNote(val:number, x: number, y: number): boolean {
        const a = (x/3 >>0)*3, b = (y/3 >>0)*3;
        for (let i = 0; i < 9; i++) {
            if (board.tile[i][y] == val) return false;
            if (board.tile[x][i] == val) return false;
            if (board.tile[a+(i%3)][b+(i/3>>0)] == val) return false;
        }
        return true;
    }
}

//isValid function -> determines if board is valid (no overlaps)
export function isValid(board: genBoardType): boolean {
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

export function randomOptions(tile: boolean[]): number[] {
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
export function rand(a: number, b: number): number {
    return (Math.random() * (b-a+1) + a) >>0;
}
