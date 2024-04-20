/**
 * @file     Difficulty.test.tsx
 * @author   Drew Mullett <dm247120@ohio.edu>
 * @brief    Testing File for Generate to see if it can handle different difficulties
 * @date     April 17, 2024
 */

import { SpaceButtonProperties } from '../SudokuFuncs';
import { initBoard } from './GenerateDifficulty';
import { describe, expect, test } from "@jest/globals";


describe("Test board generation", () => {
    test("Check if correct number of tiles are revealed for a regular sudoku puzzle", () => {
        const killer: boolean = false;
        const used: number = 0;
        const difficulty: string = "Medium";
        const testboard: SpaceButtonProperties[][] = initBoard(killer, used, difficulty);

        let count = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (testboard[i][j].data != "") {
                    count++;
                }
            }
        }
        expect(count).toBe(31);
    });

    test("Check for incorrect difficulty", () => {
        const killer: boolean = false;
        const used: number = 0;
        const difficulty: string = "Gibberish";
        const testboard: SpaceButtonProperties[][] = initBoard(killer, used, difficulty);

        let count = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (testboard[i][j].data != "") {
                    count++;
                }
            }
        }
        expect(count).toBe(81);
    });

    test("Test for high difficulty", ()=>{
        const killer: boolean = false;
        const used: number = 0;
        const difficulty: string = "K-Expert";
        const testboard: SpaceButtonProperties[][] = initBoard(killer, used, difficulty);  

        let count = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (testboard[i][j].data != "") {
                    count++;
                }
            }
        }
        expect(count).toBe(0);
    });
});