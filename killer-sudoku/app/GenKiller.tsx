/**
 * @file     GenKiller.tsx
 * @author   Nicholas Adkins <na761422@ohio.edu>
 * @brief    Generation of Killer Sudoku groups & etc
 * @date     March 31, 2024
*/

import { rand } from "./Generate";

//character used as a unique identifier for each group
const kKey: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** 
 * @brief data type for containing information abt a killer sudoku group
 * @member sum sum of all numbers in this group
 * @member size number of tiles in this group
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
    size: number,
    symbol: string
};

/** 
 * @brief Creates groups for killer sudoku based on the given board
 * @param {number[][]} tiles 2d-array of numbers taken as input
 * @return {kTile[][]} 2d-array of kTiles, containing groups designated by
 *  a symbol, and with the sum & size of each group also stored in each tile.
*/
export function genKiller(tiles: number[][]): kTile[][] {
    //# of killer groups (vary on difficulty?)
    const AmountTotal: number = 32;

    const avail = (x: number, y: number): boolean => {
        return ((0 <= x && x <= 8) && (0 <= y && y <= 8) && groups[x][y].symbol != '.');
    }

    let groups: kTile[][] = [];
    for (let i = 0; i < 9; i++) {
        groups[i] = []
        for (let j = 0; j < 9; j++) {
            groups[i][j] = {sum: tiles[i][j], size: 1, symbol: '.'};
        }
    }

    //Puts (#) of tiles into initial groups, no picking already chosen tiles
    for (let i = 0; i < AmountTotal; i++) {
        let x = 0, y = 0;
        do {
            x = rand(0,8); y = rand(0,8);
        } while (groups[x][y].symbol != '.');
        groups[x][y].symbol = kKey[i];
    }

    //for each initial group, add bordering tiles until no blanks left
    for (let numBlank = 81-AmountTotal; numBlank > 0;) {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (groups[x][y].symbol != '.') {continue;}
                let neighbors: [number,number][] = [];
                for (let [x0,y0] of [[x-1,y],[x,y-1],[x+1,y],[x,y+1]]) {
                    if (avail(x0,y0)) neighbors.push([x0,y0]);
                }
                if (neighbors.length == 0) continue;
                //sort possible options by group size: smaller groups -> higher priority
                neighbors.sort((a,b)=>{return groups[a[0]][a[1]].size-groups[b[0]][b[1]].size});
                const [a,b] = neighbors[0];
                groups[a][b].size++;
                groups[a][b].sum += groups[x][y].sum;
                groups[x][y] = groups[a][b]; //merged, both locations now point to same tile/info
                numBlank--;
            }
        }
    }    
    return groups;
}

/**
 * @brief takes an array of kTiles & outputs the top-left-most tile of each group
 * @param {kTile[][]} input array of kTiles to be used
 * @returns {[number,number,string][]} outputs an array of tuples, consisting of the
 *  x & y coordinates, as well as the char identifying that group (if needed)
 */
export function killerTopLeftVals(input: kTile[][]): [number,number,string][] {
    let keyTrack: {[i: string]: boolean} = {};
    for (let char of kKey) {
        keyTrack[char] = false;
    }
    let output: [number,number,string][] = [];
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            const char = input[x][y].symbol;
            if (keyTrack[char] == false) {
                keyTrack[char] = true;
                output.push([x,y,char]);
            }
        }
    }
    return output;
}