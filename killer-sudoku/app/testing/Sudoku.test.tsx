import { describe, expect, test } from "@jest/globals";
import { initBoard } from "../Generate";
import { HideBoard } from "../SudokuFuncs";

describe("check that the numbers define the start of a 3x3 cell", () => {
    // row
    test("checks that if we click on a cell in row 2 that the highlighting starts at row 0", () => {
        expect(Math.floor(2 / 3) * 3).toBe(0);
    });

    // col
    test("checks that if we click on a cell in column 4 that highlighting starts at 3 ", () => {
        expect(Math.floor(4 / 3) * 3).toBe(3);
    });
});

let newBoard = initBoard(false, 0);
HideBoard(newBoard);

describe("", () => {
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            test("checks that all cells are of highlighted status -> space", () => {
                newBoard[i][j].highlighted = 'space';
            });
        }
    }
});