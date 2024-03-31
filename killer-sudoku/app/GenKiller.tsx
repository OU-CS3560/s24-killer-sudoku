/**
 * @file     GenKiller.tsx
 * @author   Nicholas Adkins <na761422@ohio.edu>
 * @brief    Generation of Killer Sudoku groups & etc
 * @date     March 31, 2024
*/

import { rand } from "./Generate";

/** */
export type kGroup = {sum: number, coords: [number,number][]};

//# of killer groups (vary on difficulty?)
const AmountTotal: number = 32;

//# of one-off groups (may also vary?)
const AmountOnes: number = 3;

/** */
export function genKiller(tiles: number[][]): kGroup[] {
    let groups: kGroup[] = [];
    let used: [number,number][] = [];

    //Puts (#) of tiles into initial groups, no picking already chosen tiles
    for (let i = 0; i < AmountTotal; i++) {
        let x = -1, y = -1;
        for (let loop = true; loop;) {
            loop = false;
            x = rand(0,8); y = rand(0,8);
            for (let co of used) {
                if (x == co[0] && y == co[1]) {
                    loop = true; break;
                }
            }
        }
        groups.push({ sum: tiles[x][y], coords: [[x,y]] });
        used.push([x,y]);
    }

    //for each initial group, add bordering tiles until a certain limit(?)

    //make sure there are x number of one offs?
    
    return groups;
}