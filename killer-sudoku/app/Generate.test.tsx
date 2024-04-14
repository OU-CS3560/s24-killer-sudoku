import { initBoard } from "./Generate";
import { SpaceButtonProperties } from "./Sudoku";
import { describe, expect, test } from "@jest/globals";

describe('Test Initboard', ()=> {
    test("Check if tile reveal is correct", () =>{
        let test_board:SpaceButtonProperties[][] = initBoard(true, 2);
    });
});