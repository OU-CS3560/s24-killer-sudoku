import {initBoard, solve_sbp} from './GenerateDifficulty';
import { SpaceButtonProperties} from "./SpaceButtonProperties";
import { describe, expect, test } from "@jest/globals";


describe("Test board generation", ()=> {
    test("Check if correct number of tiles are revealed for a regular sudoku puzzle", ()=> {
        const killer: boolean = false;
        const used: number = 0;
        const difficulty: string = "Medium";
        let testboard : SpaceButtonProperties[][] = initBoard(killer, used, difficulty);

        let count = 0;
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; i++){
                if(testboard[i][j].locked){
                    count ++;
                }
            }
        }

        expect(count).toBe(31);

    });

    test("Tests for bad difficulty input", ()=> {

    });
});