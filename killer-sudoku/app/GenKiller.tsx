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
 * @param {SpaceButtonProperties[][]} board board to write dashedBorder & topLeftNumber values to
 * @return None
*/
export function genKiller(board: SpaceButtonProperties[][]): void {
    //# of killer groups (vary on difficulty?)
    const AmountTotal: number = 32;

    let groups: kTile[][] = [];
    for (let i = 0; i < 9; i++) {
        groups[i] = [];
        for (let j = 0; j < 9; j++) {
            groups[i][j] = {sum: Number(board[i][j].hiddenData), size: 1, symbol: '.'};
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
                if (groups[x][y].symbol != '.') continue;
                let neighbors: [number,number][] = [];
                for (let opt of [[x,y-1],[x+1,y],[x,y+1],[x-1,y]]) {
                    const x0 = opt[0], y0 = opt[1];
                    if (onBoard(x0,y0) && groups[x0][y0].symbol != '.') neighbors.push([x0,y0]);
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

    let keyTrack: {[i: string]: boolean} = {};
    for (let char of kKey) {
        keyTrack[char] = false;
    }
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            const char = groups[x][y].symbol;
            if (keyTrack[char] == false) {
                keyTrack[char] = true;
                board[x][y].topLeftNumber = groups[x][y].sum;
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

    // Holy Sacred Comment: Do NOT remove this comment under ANY circumstances, otherwise will break group outlines
    //  \/                                          \/
    //newBoard[0][0].mutableStatus = 'dashedBorder0000';
    //  /\                                          /\

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let neighbors: string[] = [];
            const thisSym: string = groups[x][y].symbol;
            for (let opt of [[x,y-1],[x+1,y],[x,y+1],[x-1,y]]) {
                const x0 = opt[0], y0 = opt[1];
                neighbors.push((onBoard(x0,y0) && groups[x0][y0].symbol == thisSym) ? '1' : '0');
            }
            board[x][y].mutableStatus = `dashedBorder${neighbors.join('')}`;
        }
    }
}

//checks if coords (x,y) are within board coordinates
export function onBoard(x: number, y: number): boolean {
    return ((0 <= x && x <= 8) && (0 <= y && y <= 8));
}