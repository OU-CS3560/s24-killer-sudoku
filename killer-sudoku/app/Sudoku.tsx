/**
 * @file     Sudoku.tsx
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    An element which generates a 9x9 Sudoku board, handles cell clicks, and relays timer information
 * @date     February 18, 2024
*/

"use client"; // For useState variables

import React, { ChangeEvent } from 'react';
import { TimerRef } from './Timer';

// Defines the 'class' which goes on the board. Just think of this as the properties to a single cell.
export interface SpaceButtonProperties {
    data: string,
    highlighted: string,
    savedData: string,
    hiddenData: string,
    fixedStatus: string,
    mutableStatus: string,
    locked: boolean,
    previousHighlight: string,
    marked: boolean,
    topleftnumber: number,
};

/**
 * @brief A function that utilizes use state for the board, and onChange will update accordingly
 * @returns The main board and handles almost all highlighting logic
 */
const Sudoku = ({ board, setBoard, setGameState, gameOver, timerRef, setIcon, justPaused }: { board: SpaceButtonProperties[][], setBoard: React.Dispatch<React.SetStateAction<SpaceButtonProperties[][]>>, setGameState:  React.Dispatch<React.SetStateAction<boolean>>, gameOver: boolean, timerRef: React.RefObject<TimerRef>, setIcon: React.Dispatch<React.SetStateAction<string>>, justPaused: boolean}) => {
    /**
     * @brief A function that is called when an individual cell is clicked to handle highlighting 
     * @param row - the row of the cell that was clicked
     * @param col - the column of the cell that was clicked
     * @returns a new board state after highlights
     */
    const handleCellClickHighlight = (row: number, col: number) => {
        setBoard(prevBoard => {
            // Inherit the previous board state
            const newBoard = [...prevBoard];
            console.log("*********************");
            console.log("newBoard[row][col], row " + row + ", " + col + " highlightedStatus, " + newBoard[row][col].fixedStatus);
            console.log("*********************");
            HandleHighlighting(row, col, newBoard, justPaused);
            return newBoard;
        });
    };

    /**
     * @brief A function that is called when an individual cell is clicked to handle inputs from the keyboard
     * @param row - the row of the cell that was clicked
     * @param col - the column of the cell that was clicked
     * @param e - the state of the form, provides the value going into the cell when accepting input
     * @returns newBoard - the board after highlight modifications
     */
    const handleCellClickInput = (row: number, col: number, e: ChangeEvent<HTMLInputElement>) => {
        if (!gameOver){
            setBoard(prevBoard => {
                // Inherit the previous board state
                const newBoard = [...prevBoard];
                /**
                 * @todo FIX THIS SO THAT USED GETS INCREMENTED CORRECTLY THROUGHOUT RUNTIME
                if (used === 80 || timerRef.current?.getMinutes() === 30){
                    
                    if (checkGameOver(newBoard)){
                        handleClickStopButton();
                        //victoryFunc();
                    }
                }
                */
                if (!newBoard[row][col].locked) {
                    // Cast target to int, because it's incoming as a string
                    let val = +e.target.value;
    
                    console.log("VALUE INCOMING " + val);
    
                    // Check to see if the old data is the same as the number incoming, if NaN (not a number), and if in bounds of arr
                    if (!isNaN(val) && +newBoard[row][col].data !== val && val <= 9 && val >= 0) {
                        if (val === 0) { // IMPORTANT: IF YOU ARE PRESSING DELETE ON A CELL, THE INPUT IS SET TO 0 REPEATEDLY, THUS, SET IT TO AN EMPTY VALUE
                            val = +newBoard[row][col].data;
                            newBoard[row][col].data = '';
                            /**
                             * @todo FIX THIS SO THAT USED GETS INCREMENTED CORRECTLY THROUGHOUT RUNTIME
                            used--;
                            */
                        }
                        else {
                            val = +newBoard[row][col].data;
                            newBoard[row][col].data = e.target.value.toString();
                            console.log("NEWBOARD[ROW][COL] " + newBoard[row][col].data)
                            /**
                             * @todo FIX THIS SO THAT USED GETS INCREMENTED CORRECTLY THROUGHOUT RUNTIME
                            used++;
                            */
                        }
                        HandleHighlighting(row, col, newBoard, justPaused, val);
                        // console.log(used);
                    }
                }
                // This prevents the board from resetting completely when pressing enter
                e.preventDefault();
                if (checkGameOver(newBoard)){
                    setGameState(true);
                    timerRef.current?.stop();
                    setIcon("pause_circle");
                }
                return newBoard;
            });
        }
    };

    /**
     * @brief An experimential function that permits ArrowKey inputs to move around the board.
     * @param row - the row which you originally pressed the arrow key on
     * @param col - the column which you originally pressed the arrow key on
     * @param e - the event (the key you pressed)
     
    const handleKeyboardPress = (row: number, col: number, e: React.KeyboardEvent<HTMLDivElement>) => {
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            switch (e.key) {
                case e.ctrlKey && 'z': {
                    e.preventDefault();
                    break;
                }
                case 'ArrowUp':
                    col -= 1;
                    HandleHighlighting(row, col, newBoard);
                    break;

                case 'ArrowDown':
                    col += 1;
                    HandleHighlighting(row, col, newBoard);
                    break;

                case 'ArrowLeft':
                    row -= 1;
                    HandleHighlighting(row, col, newBoard);
                    break;

                case 'ArrowRight':
                    row += 1;
                    HandleHighlighting(row, col, newBoard);
                    break;

                default:
                    break;
            }
            console.log(e.key);
            return newBoard;
        })
    };
    */

    // THIS GOES AFTER THE FUNCTION handleCellClickHighlight IN DIV WITH KEY = {COLUMNINDEX} BUT ARROW KEYS CURRENTLY AREN'T WORKING
    // onKeyDownCapture={(e) => handleKeyboardPress(rowIndex, columnIndex, e)}
    return (
        <div>
            {/* eslint-disable-next-line */}
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional:wght@100" rel="stylesheet" />
            <div className='Main'>
                {board.map((row, rowIndex) => ( /* Map the row to a column with an onclick of handling highlights and an input form */
                    <div key={rowIndex} id={rowIndex.toString()}>
                        {row.map((space, columnIndex) => (
                            <div key={columnIndex} id={columnIndex.toString()} onClick={() => handleCellClickHighlight(rowIndex, columnIndex)}>
                                <div className={space.highlighted + space.fixedStatus}>
                                    <form>
                                        <label>
                                            <fieldset className={space.mutableStatus}>
                                                <legend>
                                                    {space.topleftnumber === 0 ? "" : space.topleftnumber}
                                                </legend>
                                                <input
                                                    type='text' // Because numbers are really fucking weird for some reason
                                                    autoComplete='off'
                                                    autoCapitalize='off'
                                                    value={space.data} // The incoming value
                                                    onChange={(e) => handleCellClickInput(rowIndex, columnIndex, e)} // What to do when clicked
                                                    style={{ outline: 'none'}}
                                                />
                                            </fieldset>
                                        </label>
                                    </form>
                                </div>
                            </div>
                        ))}
                        {rowIndex !== board.length - 1 && <br />}
                    </div> // This is so that after every 9 squares generated a break tag is inserted
                ))}
            </div>
        </div>);
};

export function checkGameOver(newBoard: SpaceButtonProperties[][]): boolean{
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            if (newBoard[i][j].data !== newBoard[i][j].hiddenData){
                console.log("CHECK GAME OVER FALSE");
                return false;
            }
        }
    }
    console.log("CHECK GAME OVER TRUE");
    return true;
}

/**
 * @brief A function that handles row and column highlights as well as 3x3 highlighting
 * @param row - the row of the cell that was clicked
 * @param col - the column of the cell that was clicked
 * @param newBoard - the board we want to change
 */
export function HandleHighlighting(row: number, col: number, newBoard: SpaceButtonProperties[][], justPaused: boolean, difNum?: number) {
    if (!justPaused){
        try {
            // Clear the board of highlights
            for (let j = 0; j < 9; j++) {
                for (let k = 0; k < 9; k++) {
                    if (newBoard[j][k].highlighted !== 'spaceNumberTaken') {
                        newBoard[j][k].previousHighlight = newBoard[j][k].highlighted;
                        newBoard[j][k].highlighted = 'space'
                        console.log('j: ' + j + ', k: ' + k + ' highlighted with: ' + newBoard[j][k].highlighted);
                    }
    
                    if (newBoard[j][k].marked){
                        newBoard[j][k].marked = false;
                    }
                }
            }
    
            // Change the corresponding row and column to be highlighted
            for (let i = 0; i < 9; i++) {
                if (i !== row && newBoard[i][col].highlighted !== 'spaceNumberTaken') {
                    newBoard[i][col].previousHighlight = newBoard[i][col].highlighted;
                    newBoard[i][col].highlighted = 'spaceHighlighted';
                    console.log('1 highlighting [i][col] ' + i + ', ' + col + ' with ' + newBoard[i][col].highlighted);
                }
                if (i !== col && newBoard[row][i].highlighted !== 'spaceNumberTaken') {
                    newBoard[row][i].previousHighlight = newBoard[row][i].highlighted;
                    newBoard[row][i].highlighted = 'spaceHighlighted';
                    console.log('1 highlighting  [row][i] ' + row + ', ' + i + ' with ' + newBoard[row][i].highlighted);
                }
            }
    
            // If the old value on the board is defined (if we passed it as a parameter to this function)
            // Clear any previous highlights that this number once shared with matching data in this row or column or 3x3
            if (difNum) {
                console.log("difNum: " + difNum);
                for (let i = 0; i < 9; i++) {
                    if (newBoard[row][i].highlighted === 'spaceNumberTaken' && +newBoard[row][i].data === difNum && i !== col && doesntHaveRowColumnMatching(row, i, newBoard)) {
                        newBoard[row][i].previousHighlight = newBoard[row][i].highlighted;
                        newBoard[row][i].highlighted = 'spaceHighlighted';
                        console.log('highlighting [row][i] ' + row + ', ' + i + ' with ' + newBoard[row][i].highlighted);
                    }
                    if (newBoard[i][col].highlighted === 'spaceNumberTaken' && +newBoard[i][col].data === difNum && i !== row && doesntHaveRowColumnMatching(i, col, newBoard)) {
                        newBoard[i][col].previousHighlight = newBoard[i][col].highlighted;
                        newBoard[i][col].highlighted = 'spaceHighlighted';
                        console.log('2 highlighting [i][col] ' + i + ', ' + col + ' with ' + newBoard[i][col].highlighted);
                    }
                }
                const topLeftRow = Math.floor(row / 3) * 3;
                const topLeftCol = Math.floor(col / 3) * 3;
    
                for (let i = topLeftRow; i < topLeftRow + 3; i++) {
                    for (let j = topLeftCol; j < topLeftCol + 3; j++) {
                        if (newBoard[i][j].highlighted === 'spaceNumberTaken' && +newBoard[i][j].data === difNum && i !== row && j !== col && doesntHaveRowColumnMatching(i, j, newBoard)) {
                            newBoard[i][j].previousHighlight = newBoard[i][j].highlighted;
                            newBoard[i][j].highlighted = 'spaceHighlighted';
                            console.log('Highlighting square at ' + i + ', ' + j + ' as ' + newBoard[i][j].highlighted);
                        }
                    }
                }
            }
    
            // Check for any new matching data in the given 3x3 matrix of the cell that was clicked
            const topLeftRow = Math.floor(row / 3) * 3;
            const topLeftCol = Math.floor(col / 3) * 3;
    
            for (let i = topLeftRow; i < topLeftRow + 3; i++) {
                for (let j = topLeftCol; j < topLeftCol + 3; j++) {
                    if (newBoard[i][j].highlighted !== 'spaceNumberTaken') {
                        newBoard[i][j].previousHighlight = newBoard[i][j].highlighted;
                        newBoard[i][j].highlighted = 'spaceHighlightedLookingAt';
                        console.log('consttopleft Highlighting square at ' + i + ', ' + j + ' as ' + newBoard[i][j].highlighted);
                    }
                    if (newBoard[row][col].data === newBoard[i][j].data && i !== row && j !== col && newBoard[i][j].data !== '') {
                        newBoard[i][j].previousHighlight = newBoard[i][j].highlighted
                        newBoard[i][j].highlighted = 'spaceNumberTaken';
                        newBoard[row][col].previousHighlight = newBoard[row][col].highlighted;
                        newBoard[row][col].highlighted = 'spaceNumberTaken';
                        console.log('consttopleft Highlighting square at ' + i + ', ' + j + ' as ' + newBoard[i][j].highlighted);
                    }
                }
            }
    
            // Check for any new matching data in the given row and column of the cell that was clicked
            for (let i = 0; i < 9; i++) {
                for (let j = i + 1; j < 9; j++) {
                    if (newBoard[row][i].data === newBoard[row][j].data && newBoard[row][i].data !== '') {
                        newBoard[row][i].previousHighlight = newBoard[row][i].highlighted;
                        newBoard[row][j].previousHighlight = newBoard[row][j].highlighted;
                        newBoard[row][i].highlighted = 'spaceNumberTaken';
                        newBoard[row][j].highlighted = 'spaceNumberTaken';
                        console.log('highlighting [row][i] ' + row + ', ' + i + ' with ' + newBoard[row][i].highlighted);
                        console.log('highlighting [row][j] ' + row + ', ' + j + ' with ' + newBoard[row][j].highlighted);
                    }
                    if (newBoard[i][col].data === newBoard[j][col].data && newBoard[i][col].data !== '') {
                        newBoard[i][col].previousHighlight = newBoard[i][col].highlighted;
                        newBoard[j][col].previousHighlight = newBoard[j][col].highlighted;
                        newBoard[i][col].highlighted = 'spaceNumberTaken';
                        newBoard[j][col].highlighted = 'spaceNumberTaken';
                        console.log('3 highlighting [i][col] ' + i + ', ' + col + ' with ' + newBoard[i][col].highlighted);
                        console.log('highlighting [j][col] ' + j + ', ' + col + ' with ' + newBoard[j][col].highlighted);
                    }
                }
            }
    
            // if the highlight is not a red space
            if (newBoard[row][col].highlighted !== 'spaceNumberTaken' || newBoard[row][col].data === '' || doesntHaveRowColumnMatching(row, col, newBoard)) {
                newBoard[row][col].previousHighlight = newBoard[row][col].highlighted;
                console.log ("BEFORE HIGHLIGHTING ROW COL " + newBoard[row][col].highlighted);
                newBoard[row][col].highlighted = 'spaceHighlightedLookingAtSpecific';
                console.log('highlighting [row][col] ' + row + ', ' + col + ' with ' + newBoard[row][col].highlighted);
            }
            else {
                newBoard[row][col].previousHighlight = newBoard[row][col].highlighted;
                console.log ("BEFORE HIGHLIGHTING ROW COL 2 " + newBoard[row][col].highlighted);
                newBoard[row][col].highlighted = 'spaceNumberTaken';
                console.log('highlighting [row][col] ' + row + ', ' + col + ' with ' + newBoard[row][col].highlighted);
            }
    
            newBoard[row][col].marked = true;
        } catch (error) {
            console.log(error);
            console.log("fuck");
        }
    }
}

export function Clear(newBoard: SpaceButtonProperties[][]) {
    console.log("user clicked clear button");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            newBoard[i][j].previousHighlight = 'space';
            newBoard[i][j].highlighted='space';
            if (!newBoard[i][j].locked) {
                newBoard[i][j].data='';
            }
        }
    }
}

export function HideBoard(newBoard: SpaceButtonProperties[][]) {
    console.log("hide board");
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            newBoard[i][j].highlighted = 'space';
            newBoard[i][j].data = '';
        }
    }
}

export function SaveBoardState(newBoard: SpaceButtonProperties[][]) {
    console.log("saving this")
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            console.log("i: " + i + " j: " + j + " " + newBoard[i][j].highlighted + " with " + newBoard[i][j].data);
        }
    }

    console.log("save board state");
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            newBoard[i][j].previousHighlight = newBoard[i][j].highlighted;
            newBoard[i][j].savedData = newBoard[i][j].data;
        }
    }

    console.log("saved as")
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            console.log("i: " + i + " j: " + j + " " + newBoard[i][j].previousHighlight + " with " + newBoard[i][j].savedData);
        }
    }
}

export function ReApplyBoardState(newBoard: SpaceButtonProperties[][]){
    console.log("reapplying this")
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            console.log("i: " + i + " j: " + j + " " + newBoard[i][j].previousHighlight + " with " + newBoard[i][j].savedData);
        }
    }

    console.log("reapply board")
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            newBoard[i][j].highlighted = newBoard[i][j].previousHighlight;
            newBoard[i][j].data = newBoard[i][j].savedData;
        }
    }
}

/*
function checkGameOver(newBoard: SpaceButtonProperties[][]): boolean{
    console.log('checkGameOver');
    let correct = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (newBoard[i][j].data === newBoard[i][j].hiddenData) {
                correct++;
            }
        }
    }
    if (correct === 80) {
        return true;
    }
    else {
        return false;
    }
}
*/
/**
 * @brief A function that returns true if the given row and column doesn't have data matching in this row or column
 * @param row 
 * @param col 
 * @param newBoard 
 * @returns 
 */
function doesntHaveRowColumnMatching(row: number, col: number, newBoard: SpaceButtonProperties[][]): boolean {
    for (let i = 0; i < 9; i++) {
        if (i !== col && newBoard[row][i].data === newBoard[row][col].data && newBoard[row][i].data !== '') {
            return false;
        }
        if (i !== row && newBoard[i][col].data === newBoard[row][col].data && newBoard[i][col].data !== '') {
            return false;
        }
    }

    const topLeftRow = Math.floor(row / 3) * 3;
    const topLeftCol = Math.floor(col / 3) * 3;

    for (let i = topLeftRow; i < topLeftRow + 3; i++) {
        for (let j = topLeftCol; j < topLeftCol + 3; j++) {
            if (newBoard[row][col].data === newBoard[i][j].data && !(i === row || j === col) && newBoard[i][j].data !== '') {
                return false;
            }
        }
    }

    return true;
}

export default Sudoku;
