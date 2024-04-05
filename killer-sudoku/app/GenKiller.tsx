/**
 * @file     GenKiller.tsx
 * @author   Nicholas Adkins <na761422@ohio.edu>
 * @brief    Generation of Killer Sudoku groups & etc
 * @date     March 31, 2024
*/

import { rand } from "./Generate";
import { SpaceButtonProperties } from "./Sudoku";

//character used as a unique identifier for each group
const kKey: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** 
 * @brief data type for containing information abt a killer sudoku group
 * @member sum sum of all numbers in this group
 * @member curSize number of tiles in this group
 * @member maxSize (WIP)
 * @member symbol unique char for this group, mainly to identify
 *  the differences between each group (aka all tiles of the same group
 *  will have the same symbol attached to it)
 * @note Elsewhere, i take advantage of the fact that objects are always
 *  passed by reference in typescript, so that i have multiple spots
 *  in a kTile[][] point to the same kTile, thus not needing to worry abt
 *  updating all tiles, since those spots would just point to the same object
*/
type kTile = {
    sum: number,
    curSize: number,
    maxSize?: number,
    symbol: string
};

/** 
 * @brief Creates groups for killer sudoku based on the given board
 * @param {SpaceButtonProperties[][]} board board to write dashedBorder & topLeftNumber values to
 * @return None
*/
export function genKiller(board: SpaceButtonProperties[][]): void {

    //TODO: rework this so that it is based on difficulty
    //Percent Configuration, switch around values
    const percent: {[n: number]: number} = {
        1: 15,
        2: 35,
        3: 35,
        4: 15,
        5: 0

    };

    //checks if coords (x,y) are within board coordinates
    const onBoard = (x: number, y: number): boolean => {
        return ((0 <= x && x <= 8) && (0 <= y && y <= 8));
    }

    //Initialize killer group grid
    let arr: kTile[][] = [];
    for (let i = 0; i < 9; i++) {
        arr[i] = [];
        for (let j = 0; j < 9; j++) {
            arr[i][j] = {sum: Number(board[i][j].hiddenData), curSize: 1, symbol: '.'};
        }
    }

    //Puts (#) of tiles into initial groups, no picking already chosen tiles or tiles next to those
    let numGroups: number = 0;
    for (let numOcc = 0; numOcc < 81;) {
        let x = 0, y = 0;
        do {
            x = rand(0,8); y = rand(0,8);
        } while (arr[x][y].symbol != '.');
        arr[x][y].symbol = kKey[numGroups];
        numOcc++; numGroups++;
        const borders: [number,number][] = [[x,y-1],[x+1,y],[x,y+1],[x-1,y]];
        for (let [x0,y0] of borders) {
            if (!onBoard(x0,y0)) continue;
            if (arr[x0][y0].symbol == '.') {arr[x0][y0].symbol = '/'; numOcc++;}
        }
    }

    //attach a maximum group size for each group on the board
    for (let row of arr) {
        for (let val of row) {
            if (val.symbol == '.' || val.symbol == '/') continue;
            const rNum = Math.random()*100;
            if (rNum > 85)
        }
    }

    //for each initial group, add bordering tiles until no blanks left
    for (let numBlank = 81-numGroups; numBlank > 0;) {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (arr[x][y].symbol == '.' || arr[x][y].symbol == '/') continue;

            }
        }
    }

    /*
                if (groups[x][y].symbol != '.' && groups[x][y].symbol != '/') continue;
                let neighbors: [number,number][] = [];
                for (let opt of [[x,y-1],[x+1,y],[x,y+1],[x-1,y]]) {
                    const x0 = opt[0], y0 = opt[1];
                    if (!onBoard(x0,y0)) continue;
                    if (groups[x0][y0].symbol == '.' || groups[x0][y0].symbol == '/') continue;
                    if (groups[x0][y0].size < sizeLimit) neighbors.push([x0,y0]);
                }
                const neiLen = neighbors.length;
                if (neiLen == 0) continue;

                for (let i = 0; i < neiLen; i++) {
                    const j = rand(0,neiLen-1);
                    const temp = neighbors[i];
                    neighbors[i] = neighbors[j];
                    neighbors[j] = temp;
                }

                let numNeighborsSzG4 = 0;
                for (let [a,b] of neighbors) {
                    if (groups[a][b].size >= sizeLimit-1) {numNeighborsSzG4++; continue;}
                    groups[a][b].size++;
                    groups[a][b].sum += groups[x][y].sum;
                    groups[x][y] = groups[a][b]; //merged, both locations now point to same tile/info
                    break;
                }
                if (numNeighborsSzG4 == neiLen) {
                    groups[x][y].symbol = kKey[numGroups]; numGroups++;
                }
                numBlank--;
    */

    let keyTrack: {[i: string]: boolean} = {};
    for (let char of kKey) {
        keyTrack[char] = false;
    }
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            const char = arr[x][y].symbol;
            if (keyTrack[char] == false) {
                keyTrack[char] = true;
                board[x][y].topLeftNumber = arr[x][y].curSize;
            }
        }
    }

    /* START OF MUTABLE BORDER ALGORITHM 

    // random number hash for identifier, boolean for visited
    let mapping = new Map<number, boolean>();

    switch(percentage){

        //no default case because its defined in a range of 1-100
    }
    */

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            board[x][y].mutableStatus = 'dashedBorder0000'; //Need to do this for some reason
            let neighbors: string[] = [];
            const thisSym: string = arr[x][y].symbol;
            for (let opt of [[x,y-1],[x+1,y],[x,y+1],[x-1,y]]) {
                const x0 = opt[0], y0 = opt[1];
                neighbors.push((onBoard(x0,y0) && arr[x0][y0].symbol == thisSym) ? '1' : '0');
            }
            board[x][y].mutableStatus = `dashedBorder${neighbors.join('')}`;
        }
    }
}
