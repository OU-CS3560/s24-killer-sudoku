/**
 * @file     GenKiller.ts
 * @author   Nicholas Adkins <na761422@ohio.edu>
 * @brief    Generation of Killer Sudoku groups & etc
 * @date     March 31, 2024
*/

import { rand } from "./Generate";
import { SpaceButtonProperties } from "./SudokuFuncs";

//character used as a unique identifier for each group
const kKey: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** 
 * @brief data type for containing information abt a killer sudoku group
 * @member sum sum of all numbers in this group
 * @member curSize number of tiles in this group
 * @member maxSize maximum size of a particular group
 * @member symbol unique char for this group, mainly to identify
 *  the differences between each group (aka all tiles of the same group
 *  will have the same symbol attached to it)
 * @note Elsewhere, i take advantage of the fact that objects are always
 *  passed by reference in typescript, so that i have multiple spots
 *  in a kTile[][] point to the same kTile, thus not needing to worry abt
 *  updating all tiles, since those spots would just point to the same object
*/
export type kTile = {
    sum: number,
    curSize: number,
    maxSize: number,
    symbol: string
};

/**
 * @brief Map corresponding to the chances a group may
 *  contain a certain maximum number of tiles.
 *  Feel free to change these values
 * @note This is Percentage CDF, not a PMF/PDF.
 */
const killerGroupCDF = new Map<number,number> ([
    [1, 10], //10%
    [2, 45], //35%
    [3, 80], //35%
    [4, 95], //15%
    [5, 100] //5%
]);

/** 
 * @brief Creates groups for killer sudoku based on the given board
 * @param {number[][]} tiles input tile values (for calculating sums)
 * @return {kTile[][]} 2d array of the killer groups
*/
export function genKiller(tiles: number[][]): kTile[][] {

    //randomly chooses a number (1-5) based on CDF percentages
    const randMaxSize = (): number => {
        const rNum = Math.random()*100;
        let n: number = 1;
        while ((killerGroupCDF.get(n) ?? 100) <= rNum) n++;
        return n;
    }

    //Initialize killer group grid
    let arr: kTile[][] = [];
    for (let x = 0; x < 9; x++) {
        arr[x] = [];
        for (let y = 0; y < 9; y++) {
            arr[x][y] = {sum: tiles[x][y], curSize: 1, maxSize: 1, symbol: '.'};
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
            val.maxSize = randMaxSize();
        }
    }

    //for each initial group, add bordering tiles until no blanks left
    for (let numBlank = 81-numGroups; numBlank > 0;) {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (arr[x][y].symbol != '.' && arr[x][y].symbol != '/') continue;
                let allNeigh: [number,number][] = [], 
                    avaNeigh: [number,number][] = [];
                const options: [number,number][] = [[x,y-1],[x+1,y],[x,y+1],[x-1,y]];
                for (let [x0,y0] of options) {
                    if (!onBoard(x0,y0)) continue;
                    const tile = arr[x0][y0];
                    if (tile.symbol != '.' && tile.symbol != '/') allNeigh.push([x0,y0]);
                    if (tile.curSize < tile.maxSize) avaNeigh.push([x0,y0]);
                }
                if (allNeigh.length == 0) continue;
                if (avaNeigh.length == 0) {
                    arr[x][y].symbol = kKey[numGroups];
                    arr[x][y].maxSize = randMaxSize();
                    numGroups++; numBlank--;
                    continue;
                }
                const [a,b] = avaNeigh[rand(0,avaNeigh.length-1)];
                arr[a][b].curSize++;
                arr[a][b].sum += arr[x][y].sum;
                arr[x][y] = arr[a][b]; //merged, both locations now point to same tile/info
                numBlank--;
            }
        }
    }

    //Go back over & combine most of the leftover size-1 groups
    let numOf1Groups: number = 0; 
    for (let row of arr) { 
        for (let val of row) {
            if (val.curSize == 1) numOf1Groups++; 
        } 
    }
    for (let x = 0; x < 9 && numOf1Groups > 3; x++) {
        for (let y = 0; y < 9 && numOf1Groups > 3; y++) {
            if (arr[x][y].curSize != 1) continue;
            let avaNeigh: [number,number][] = [];
            const options: [number,number][] = [[x,y-1],[x+1,y],[x,y+1],[x-1,y]];
            for (let [x0,y0] of options) {
                if (!onBoard(x0,y0)) continue;
                const tile = arr[x0][y0];
                if (tile.symbol == '.' || tile.symbol == '/') continue;
                if (tile.curSize < tile.maxSize || tile.maxSize == 1 || tile.maxSize == 2) 
                    avaNeigh.push([x0,y0]);
            }
            if (avaNeigh.length == 0) continue;
            const [a,b] = avaNeigh[rand(0,avaNeigh.length-1)];
            arr[a][b].curSize++;
            if (arr[a][b].curSize > arr[a][b].maxSize) arr[a][b].maxSize++;
            arr[a][b].sum += arr[x][y].sum;
            arr[x][y] = arr[a][b]; //merged, both locations now point to same tile/info
            numOf1Groups--;
        }
    }

    return arr;
}

/**
 * @brief (WIP desc) apply topleftnum & dashedBorder to SBP[][]
 * @param arr 
 * @param board 
 * @return None
 */
export function doKillerUIStuff(arr: kTile[][], board: SpaceButtonProperties[][]): void {

    let keyTrack: {[i: string]: boolean} = {};
    for (let char of kKey) {
        keyTrack[char] = false;
    }
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            const char = arr[x][y].symbol;
            if (keyTrack[char] == false) {
                keyTrack[char] = true;
                board[x][y].topLeftNumber = arr[x][y].sum;
            }
        }
    }

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

export function undef_kArr(): kTile[][] {
    return [[{sum: -1, curSize: -1, maxSize: -1, symbol: '?'}]];
}

//checks if coords (x,y) are within board coordinates
function onBoard (x: number, y: number): boolean {
    return ((0 <= x && x <= 8) && (0 <= y && y <= 8));
}