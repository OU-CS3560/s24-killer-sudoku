/**
 * @file     Generation.test.tsx
 * @author   Nicholas Adkins <na761422@ohio.edu>
 * @brief    Testing File for Generate, GenKiller, and Solver
 * @date     April 17, 2024
*/

import { describe, expect, test } from "@jest/globals";
import { genBoard, solve_gen } from "../Solver";
import { genKiller, kTile } from "../GenKiller";

//Does adding a tile to a genBoard 
// change every internal value accordingly?
describe("When Adding to a genBoard tile", ()=>{
    let board = new genBoard;
    board.add(1,4,4);

    test("tile gets updated", ()=>{
        expect(board.tile[4][4]).toBe(1);
    });
    test("note in tile is turned off", ()=>{
        expect(board.note[4][4][1]).toBe(false);
    });
    test("occ is now incremented", ()=>{
        expect(board.occ).toBe(1);
    });
    describe("notesPerTile", ()=>{
        test("...is now 0 for this tile", ()=>{
            expect(board.notesPerTile[4][4]).toBe(0);
        });
        test("...is now 8 for other tiles", ()=>{
            expect(board.notesPerTile[4][3]).toBe(8);
        });
    });
    describe("notesPerRow", ()=>{
        test("...is now 0 for this row", ()=>{
            expect(board.notesPerRow[1][4]).toBe(0);
        });
        test("...is now 6 for other rows in this 3x3", ()=>{
            expect(board.notesPerRow[1][3]).toBe(6);
        });
        test("...is now 8 for other rows", ()=>{
            expect(board.notesPerRow[1][2]).toBe(8);
        });
    });
    describe("changes", ()=>{
        test("... latest has a total of 29 changes", ()=>{
            const lastChange = board.changes[board.changes.length-1];
            expect(lastChange[2].length == 29);
        });
    });
    //Ok theres a ton of other combinations and other
    // stuff to check here, but i don't really have
    // the time to implement the rest of them
});

//Does the same happen when you remove a tile?
describe("When Removing From the board", ()=>{
    let board = new genBoard;
    board.add(1,4,4);
    board.undo();

    test("tile is now blank", ()=>{
        expect(board.tile[4][4]).toBe(0);
    });
    test("note in tile is now available", ()=>{
        expect(board.note[4][4][1]).toBe(true);
    });
    test("occ is now decremented", ()=>{
        expect(board.occ).toBe(0);
    });
    //Same here, too much to go over & not enough time
});

//Does the killer group generation not
// have any groups over size 5 or below 1
describe("Calling genKiller", ()=>{
    const input: number[][] = [
        [2,8,5,4,1,3,6,7,9],
        [1,4,6,7,9,8,3,5,2],
        [7,9,3,6,5,2,8,1,4],
        [9,3,7,1,2,6,5,4,8],
        [8,6,2,5,4,7,1,9,3],
        [5,1,4,8,3,9,2,6,7],
        [3,2,1,9,7,5,4,8,6],
        [4,7,8,2,6,1,9,3,5],
        [6,5,9,3,8,4,7,2,1]
    ];
    let kBoard: kTile[][] = genKiller(input);
    test("1 <= kBoard size <= 5", ()=>{
        for (let row of kBoard) {
            for (let val of row) {
                expect(val.curSize).toBeGreaterThanOrEqual(1);
                expect(val.curSize).toBeLessThanOrEqual(5);
                expect(val.maxSize).toBeGreaterThanOrEqual(1);
                expect(val.maxSize).toBeLessThanOrEqual(5);
            }
        }
    });
});

//Does the main methods in solve_gen function properly?
describe("Calling solve_gen", ()=>{
    test("Method 1 Works", ()=>{
        let board = new genBoard;
        board.add(1,0,0);
        board.add(2,1,0);
        board.add(3,2,0);
        board.add(4,2,1);
        board.add(5,2,2);
        board.add(6,1,2);
        board.add(7,0,2);
        board.add(8,0,1);
        solve_gen(board); //Should solve 9@(1,1)
        expect(board.tile[1][1]).toBe(9);
    });
    test("Method 2 Works", ()=>{
        let board = new genBoard;
        board.add(2,0,0);
        board.add(2,3,1);
        board.add(2,6,5);
        board.add(2,8,7);
        solve_gen(board); //Should solve 2@(7,2)
        expect(board.tile[7][2]).toBe(2);
    });
    //TODO: When (or even if) i add more solver methods, add tests here
});