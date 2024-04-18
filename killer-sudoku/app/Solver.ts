/**
 * @file     Solver.ts
 * @author   Nicholas Adkins <na761422@ohio.edu>
 * @brief    Function to solve a board / make progress in solving it
 * @date     March 8, 2024
*/

import { kTile, undef_kArr } from "./GenKiller";

/**
 * @brief takes input board & tries to solve it
 * @param {genBoard} board input board to be solved (passed by reference) 
 * @param {kTile[][]} kArr (WIP) 
 * @returns {number} number of changes that were made during this solve call
 */
export function solve_gen(board: genBoard, kArr: kTile[][] = undef_kArr()): number {
    let numChanges: number = 0;
    let tiles: number[][] = board.tile, notes: boolean[][][] = board.note;
    //const killer: boolean = (kArr[0][0].sum != -1);

    const success = (val: number, x: number, y: number): void => {
        numChanges++;
        board.add(val,x,y);
    }

    // Method K0: If using killer sudoku within tile
    // showing, initialize notes based on killer groups
    /*
    if (killer) {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (board.tile[x][y] != 0) continue;
                let tile: kTile = kArr[x][y];
                switch (tile.curSize) {
                    case 1: {
                        success(tile.sum,x,y,101); break;
                    }
                    case 2: {
                        break;
                    }
                    default: break;
                }
                continue;

                let minVal = -1, maxVal = 10;
                
                if (tile.curSize == 2) {
                    minVal = (tile.sum-9 >= 1) ? tile.sum-9 : 1;
                    maxVal = (tile.sum-1 <= 9) ? tile.sum-1 : 9;
                }
                //else {}
                for (let n = 1; n < minVal; n++) {
                    board.note[x][y][n] = false;
                }
                for (let n = maxVal; n <= 9; n++) {
                    board.note[x][y][n] = false;
                }
                
            }
        }
    }
    */

    for (let progress: boolean = true; progress == true;) {
        progress = false;

        // Method 1: if theres only one note in a tile, put it in
        for (let x = 0; x < 9; x++) { 
            for (let y = 0; y < 9; y++) {
                if (tiles[x][y] != 0) continue;
                switch (board.notesPerTile[x][y]) {
                    case 1: {
                        for (let n = 1; n <= 9; n++) {
                            if (!notes[x][y][n]) continue;
                            success(n,x,y);
                            progress = true; 
                        } break;
                    }
                    case 0: {
                        board.state = false;
                        return numChanges;
                    }
                    default: break;
                }
            }
        }

        // Method 2: if theres only one note of a type in a row/col/3x3, put it in
        for (let n: number = 1; n <= 9; n++) {
            for (let d1 = 0; d1 < 9; d1++) {
                if (board.notesPerRow[n][d1] == 1) {
                    for (let d2 = 0; d2 < 9; d2++) {
                        if (!notes[d1][d2][n]) continue;
                        success(n,d1,d2);
                        progress = true; 
                    }
                }
                if (board.notesPerCol[n][d1] == 1) {
                    for (let d2 = 0; d2 < 9; d2++) {
                        if (!notes[d2][d1][n]) continue;
                        success(n,d2,d1);
                        progress = true; 
                    }
                }
                const a = d1/3>>0, b = d1%3;
                if (board.notesPer3x3[n][a][b] == 1) {
                    for (let d2 = 0; d2 < 9; d2++) {
                        const x = 3*a+(d2/3>>0), y = 3*b+(d2%3);
                        if (!notes[x][y][n]) continue;
                        success(n,x,y);
                        progress = true;
                    }
                }
            }
        }

        // Method 3: if two types of notes form a pair, then remove all other
        //  notes from those tiles & those notes from that 3x3
        //  TODO: also include triples too
            //1: find how many of all given notes appear in a 3x3
            //2: filter out any note not having exactly two 1s, then calc exact order (Like "100100000")
            //3: compare all remaining strings. if two are equal, then ->
            //3.1:  remove all other notes in those tiles, and all of these two notes in the 3x3
            //4: else continue to next 3x3
        /*for (let a = 0; a < 3; a++) {
            for (let b = 0; b < 3; b++) {
                let arr: number[] = [];
                for (let n = 1; n <= 9; n++) {
                    if (board.notesPer3x3[n][a][b] == 2) arr.push(n);
                }
                //WIP
            }
        }*/


        // Method 4: if one note exists only in two/three tiles in a 3x3, and
        //  those are in same row/col, then remove all others in that row/col
            //1: For 3x Row: check boolean, skip 3x Row if false
            //2: Check all tiles in 3x Row for given num
            //3: if num appears twice, continue to next (& record), else count all notes
            //4: if all notes in a given 3x3 line up, eliminate all others from that single row
            //5: repeat process for cols
        //for (let n: number = 1; n <= 9; n++) {
            
        //}

        // Method 5: "X-Wing", idk how else to describe it: its the last one in this link
        //  https://www.conceptispuzzles.com/index.aspx?uri=puzzle/sudoku/techniques
        //WIP

        //eliminate all notes in this row, except for certain y values
        /*function clearRow(row: number, n: number, yVals: number[]): void {
            if (debug) console.log(`Nar: ${n} @ R ${row} to -> ${yVals}`);
            for (let y = 0; y < 9; y++) {
                if (y == yVals[0] || y == yVals[1] || y == (yVals[2] ?? -1)) continue;
                notes[row][y][n] = false;
            }
        }*/
        //eliminate all notes in this col, except for certain x values
        /*function clearCol(col: number, n: number, xVals: number[]): void {
            if (debug) console.log(`Nar: ${n} @ C ${col} to -> ${xVals}`);
            for (let x = 0; x < 9; x++) {
                if (x == xVals[0] || x == xVals[1] || x == (xVals[2] ?? -1)) continue;
                notes[x][col][n] = false;
            }
        }*/
    }

    return numChanges;
}

//Extra stuff below:

/**
 * @brief class used during the generation process
 * @member tile keeping track of the actual present values on the board
 * @member note keep track of all available options for the other tiles
 * @member occ number of tiles occupied
 * @member state set to false if board is unsolvable -> go back
 * @member (WIP)
 */
export class genBoard {
    tile: number[][]; //actual tiles of the board
    note: boolean[][][]; //possible options per tile
    occ: number; //number of tiles occupied
    state: boolean; //false if error occurs & needs to back out in generation process

    notesPerTile: number[][]; //number of notes in an empty tile (x,y)
    notesPerRow: number[][]; //number of a note in a row (n,y)
    notesPerCol: number[][]; //number of a note in a col (n,x)
    notesPer3x3: number[][][]; //number of a note in a 3x3 (n,x/3,y/3)
    //WIP: A lot more variations of this stuff
    //m4Check: boolean[][][]; //WIP (n,x/3,y/3)

    changes: [ //keeps track of every single tile & note change
        number,number, //tile x & y coords
        [number,number,number][] //all noted modified as a result of change in tile
    ][]; //stored as an array (used like a stack)

    /**
     * @brief creates a blank genBoard, with each value initialized
     * @note looks weird, but this way there are no duplicate values, or arrays pointing to the same value
     */
    constructor () {
        const tr  =()=>{return [true,true,true,true,true,true,true,true,true,true];}
        const Rtr =()=>{return [tr(),tr(),tr(),tr(),tr(),tr(),tr(),tr(),tr()];}
        const R0  =()=>{return [0,0,0,0,0,0,0,0,0];}
        const R9  =()=>{return [9,9,9,9,9,9,9,9,9];}
        const TbT =()=>{return [[9,9,9],[9,9,9],[9,9,9]];}
        //const fa  =()=>{return [[false,false,false],[false,false,false],[false,false,false]];}
        
        this.tile = [R0(),R0(),R0(),R0(),R0(),R0(),R0(),R0(),R0()];
        this.note = [Rtr(),Rtr(),Rtr(),Rtr(),Rtr(),Rtr(),Rtr(),Rtr(),Rtr()];
        this.occ = 0;
        this.state = true;
        this.notesPerTile = [R9(),R9(),R9(),R9(),R9(),R9(),R9(),R9(),R9()];
        this.notesPerRow = [[],R9(),R9(),R9(),R9(),R9(),R9(),R9(),R9(),R9()];
        this.notesPerCol = [[],R9(),R9(),R9(),R9(),R9(),R9(),R9(),R9(),R9()];
        this.notesPer3x3 = [[],TbT(),TbT(),TbT(),TbT(),TbT(),TbT(),TbT(),TbT(),TbT()];
        //this.m4Check = [[],fa(),fa(),fa(),fa(),fa(),fa(),fa(),fa(),fa()];
        this.changes = [];
    }

    /**
     * @brief Adds a value to a tile of a board, adjusts notes accordingly
     * @param {number} val value being inserted
     * @param {number} x coordinate of this tile
     * @param {number} y coordinate of this tile
     * @returns {void} None
     */
    add (val: number, x: number, y: number): void {
        const handleNotes = (val: number, x: number, y: number): void => {
            if (!this.note[x][y][val]) return;
            this.note[x][y][val] = false;
            this.notesPerTile[x][y]--;
            this.notesPerRow[val][x]--;
            this.notesPerCol[val][y]--;
            this.notesPer3x3[val][x/3>>0][y/3>>0]--;
            noteChanges.push([val,x,y]);
        }
        let noteChanges: [number,number,number][] = [];
        if (this.tile[x][y] != 0) return;
        this.tile[x][y] = val;
        this.occ++;
        const a = (x/3 >>0)*3, b = (y/3 >>0)*3;
        for (let i = 0; i < 9; i++) {
            handleNotes(val,i,y); //each in row
            handleNotes(val,x,i); //each in col
            handleNotes(val,(i%3)+a,(i/3>>0)+b); //each in 3x3
            handleNotes(i+1,x,y); //each in this tile
        }
        this.changes.push([x,y,noteChanges]);
    }

    /**
     * @brief Undo all changes from the most recent this.add call
     * @param None
     * @returns {[number,number,number]} tuple of [val,x,y] of the undone modification
     */
    undo (): [number,number,number] {
        const [x0,y0,noteChanges] = this.changes.pop() ?? [0,0,[[this.tile[0][0],0,0]]];
        let thisVal = -1;
        if (x0 != -1 && y0 != -1) {
            thisVal = this.tile[x0][y0];
            this.tile[x0][y0] = 0;
            this.occ--;
        }
        for (let [val,x,y] of noteChanges) {
            this.note[x][y][val] = true;
            this.notesPerTile[x][y]++;
            this.notesPerRow[val][x]++;
            this.notesPerCol[val][y]++;
            this.notesPer3x3[val][x/3>>0][y/3>>0]++;
        }
        return [thisVal,x0,y0];
    }

    /**
     * @brief determines if the given board is full & is a valid sudoku board
     * @param None
     * @returns {boolean} true if full & valid/solved, false otherwise
     */
    isValid (): boolean {
        if (this.occ != 81) return false;
        for (let d1 = 0; d1 < 9; d1++) {
            const a = (d1%3)*3, b = (d1/3>>0)*3;
            let nums1: boolean[] = [];
            let nums2: boolean[] = [];
            let nums3: boolean[] = [];
            for (let d2 = 0; d2 < 9; d2++) {
                const tile1 = this.tile[d1][d2];
                if (nums1[tile1]) return false;
                nums1[tile1] = true;
                const tile2 = this.tile[d2][d1];
                if (nums2[tile2]) return false;
                nums2[tile2] = true;
                const tile3 = this.tile[a+(d2%3)][b+(d2/3>>0)];
                if (nums3[tile3]) return false;
                nums3[tile3] = true;
            }
        }
        return true;
    }
}
