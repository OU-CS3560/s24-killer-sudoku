/**
 * @file     Solver.tsx
 * @author   Nicholas Adkins <na761422@ohio.edu>
 * @brief    Function to solve a board / make progress in solving it
 * @date     March 8, 2024
*/

/**
 * @brief takes input board & tries to solve it
 * @param {genBoardType} board input board to be solved (passed by reference) 
 * @param {number} opt (WIP) parameter to select which solving methods to use:
 *  0 (default) for all, 1 for 1st method only, 2 for 1st & 2nd, etc. 3,4,5 are WIP
 * @returns {[number,number][]} array of changed tiles, stored as a tuple of [x,y], both numbers
 */
export function solve_gen(board: genBoardType, opt: number = 0): [number,number][] {
    const changes: [number,number][] = [];
    const tiles: number[][] = board.tile, notes: boolean[][][] = board.note;

    for (let progress: boolean = true; progress == true;) {
        progress = false;

        //solved a tile successfully, do stuff
        const success = (val: number, x: number, y: number): void => {
            progress = true; 
            changes.push([x,y]);
            boardAdd(board,val,x,y);
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
                    success(val,x,y);
                }
                if (val == -1) { //tile is blank w/ no possible options -> BAD, return
                    board.state = false;
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
                    success(n,d1,valR);
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
                    success(n,valC,d1);
                }
            }
        }}

        // Method 3: if one note exists only in two/three tiles in a 3x3, and
        // those are in same row/col, then remove all others in that row/col
        // NOTE: This doesnt work properly, but i dont really have
        // the time to fix it, need to focus on other things
        /*if (opt == 0 || opt >= 3) {
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

            for (let n: number = 1; n <= 9; n++) {
                for (let x = 0; x < 9; x++) {
                    let arr: [number,number][] = [];
                    for (let y = 0; y < 9; y++) {
                        const a = (y % 3)+(x % 3)*3, b = (y/3 >>0)+(x/3 >>0)*3;
                        if (tiles[a][b] == n) {arr = []; break;}
                        if (tiles[a][b] == 0 && notes[a][b][n]) arr.push([a,b]);
                    }
                    if (arr.length == 2) {
                        if (arr[0][0] == arr[1][0]) { //if same 'a' val
                            clearRow(arr[0][0],n);
                        }
                        if (arr[0][1] == arr[1][1]) { //if same 'b' val
                            clearCol(arr[0][1],n);
                        }
                    }
                    if (arr.length == 3) {
                        if (arr[0][0] == arr[1][0] && arr[1][0] == (arr[2])[0]) { //if same 'a' val
                            clearRow(arr[0][0],n); 
                        }
                        if (arr[0][1] == arr[1][1] && arr[1][1] == (arr[2])[1]) { //if same 'b' val
                            clearCol(arr[0][1],n);
                        }
                    }
                }
            }
        }*/

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

/**
 * @brief data type used during the generation process
 * @member tile keeping track of the actual present values on the board
 * @member note keep track of all available options for the other tiles
 * @member occ number of tiles occupied
 * @member state set to false if board is unsolvable -> go back
 */
export type genBoardType = {
    tile: number[][], note: boolean[][][], occ: number, state: boolean
};

/**
 * @brief creates a blank genBoardType, with each value initialized
 * @note looks weird, but this way there are no duplicate values, or arrays pointing to the same value
 * @returns {genBoardType} initialized board
 */
export function makeBoard(): genBoardType {
    const bl = () => {return [true,true,true,true,true,true,true,true,true,true]};
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
        occ: 0, state: true
    };
}

/**
 * @brief Adds a value to a tile of a board, adjusts the notes accordingly
 * @param {genBoardType} board board to be modified
 * @param {number} val value being inserted
 * @param {number} x coordinate of this tile
 * @param {number} y coordinate of this tile
 * @returns {void} None
 */
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

/**
 * @brief Removes a value from a tile of a board, adjusts the notes accordingly
 * @param {genBoardType} board board to be modified
 * @param {number} x coordinate of this tile
 * @param {number} y coordinate of this tile
 * @returns {void} None
 */
export function boardRem(board: genBoardType, x: number, y: number): void {
    const reCalcNote = (val:number, x: number, y: number): boolean => {
        const a = (x/3 >>0)*3, b = (y/3 >>0)*3;
        for (let i = 0; i < 9; i++) {
            if (board.tile[i][y] == val) return false;
            if (board.tile[x][i] == val) return false;
            if (board.tile[a+(i%3)][b+(i/3>>0)] == val) return false;
        }
        return true;
    }
    const val = board.tile[x][y];
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
}
