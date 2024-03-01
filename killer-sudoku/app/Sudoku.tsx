/**
 * @file     Sudoku.tsx
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    An element which generates a 9x9 Sudoku board and handles cell clicks
 * @date     February 18, 2024
*/

"use client"; // for useState variables

import React, { ChangeEvent, useState } from 'react';
import { initBoard } from './Generate';

// Defines the 'class' which goes on the board. Just think of this as the properties to a single cell.
export interface SpaceButtonProperties {
    data: string,
    hiddenData: string,
    highlighted?: string,
    locked: boolean
};

/**
 * @brief A function that utilizes use state for the board, and onChange will update accordingly
 * @returns The main board and handles almost all highlighting logic.
 */
const SudokuBoard = () => {
    // Use state for the whole board
    const [board, setBoard] = useState(() => {
        return initBoard();
    });

    const handleClickSolveButton = () => {
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            Solve(newBoard);
            return newBoard;
        });
    }

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
            HandleHighlighting(row, col, newBoard);
            return newBoard;
        });
    };

    /**
     * @brief A function that is called when an individual cell is clicked to handle inputs from the keyboard
     * @param row - the row of the cell that was clicked
     * @param col - the column of the cell that was clicked
     * @param e - the state of the form, provides the value going into the cell when accepting input
     * @returns
     */
    const handleCellClickInput = (row: number, col: number, e: ChangeEvent<HTMLInputElement>) => {
        setBoard(prevBoard => {
            // Inherit the previous board state
            const newBoard = [...prevBoard];
            if (!newBoard[row][col].locked){
                // Cast target to int, because it's incoming as a string
                let val = +e.target.value;
                
                // Check to see if the old data is the same as the number incoming, if NaN (not a number), and if in bounds of arr
                if (!isNaN(val) && +newBoard[row][col].data !== val && val <= 9 && val >= 0){
                    if (val === 0){ // IMPORTANT: IF YOU ARE PRESSING DELETE ON A CELL, THE INPUT IS SET TO 0 REPEATEDLY, THUS, SET IT TO AN EMPTY VALUE
                        val = +newBoard[row][col].data;
                        newBoard[row][col].data = '';
                    }
                    else{
                        val = +newBoard[row][col].data;
                        newBoard[row][col].data = e.target.value.toString();
                    }
                }
                HandleHighlighting(row, col, newBoard, val);
            }
            // This prevents the board from resetting completely when pressing enter
            e.preventDefault();
            return newBoard;
        })
    };

    return (
        <div>
            <div className="Main">
            {board.map((row, rowIndex) => ( /* Map the row to a column with an onclick of handling highlights and an input form */
                <div key={rowIndex} id={rowIndex.toString()}>
                    {row.map((space, columnIndex) => (
                        <div key={columnIndex} id={columnIndex.toString()} onClick={() => handleCellClickHighlight(rowIndex, columnIndex)}>
                            <input
                                type='text' // because numbers are really fucking weird for some reason
                                autoComplete='off'
                                autoCapitalize='off'
                                value={space.data} // the incoming value
                                className={space.highlighted}
                                onChange={(e) => handleCellClickInput(rowIndex, columnIndex, e)} // what to do when clicked
                            />
                        </div>
                    ))}
                    {rowIndex !== board.length - 1 && <br />}
                </div> // This is so that after every 9 squares generated a break tag is inserted
            ))}
            </div>
            <button className='solveButton' onClick={() => handleClickSolveButton()}>
                Solve
            </button>
        </div>);
};

/**
 * @brief A function that handles row and column highlights as well as 3x3 highlighting
 * @param row - the row of the cell that was clicked
 * @param col - the column of the cell that was clicked
 * @param newBoard - the board we want to change
 */
export function HandleHighlighting(row: number, col: number, newBoard: SpaceButtonProperties[][], difNum?: number){
    try {
        // Clear any current highlights
        for (let j = 0; j < 9; j++){
            for (let k = 0; k < 9; k++){
                if (newBoard[j][k].highlighted !== 'spaceNumberTakenInRowOrColumn' && !newBoard[j][k].locked)
                    newBoard[j][k].highlighted='space'
                console.log('j: ' + j + ', k: ' + k + ' highlighted with: ' + newBoard[j][k].highlighted)
            }
        }

        // If the old value on the board isn't undefined (if we passed it as a parameter to this function)
        if (difNum){
            for (let i = 0; i < 9; i++){
                // Clear any previous highlights that this number once shared with matching data in this row or column
                if (newBoard[row][i].highlighted === 'spaceNumberTakenInRowOrColumn' && +newBoard[row][i].data === difNum){
                    newBoard[row][i].highlighted = 'spaceHighlighted';
                }
                if (newBoard[i][col].highlighted === 'spaceNumberTakenInRowOrColumn' && +newBoard[i][col].data === difNum){
                    newBoard[i][col].highlighted = 'spaceHighlighted';
                }
            }
        }

        // Change the corresponding row and column to be highlighted
        for (let i = 0; i < 9; i++) {
            if (i !== row && newBoard[i][col].highlighted !== 'spaceNumberTakenInRowOrColumn'){
                newBoard[i][col].highlighted='spaceHighlighted';
                console.log('highlighting [i][col] ' + i + ', ' + col + ' with ' + newBoard[i][col].highlighted)
            }
            if (i !== col && newBoard[row][i].highlighted !== 'spaceNumberTakenInRowOrColumn'){
                newBoard[row][i].highlighted='spaceHighlighted';
                console.log('highlighting  [row][i] ' + row + ', ' + i + ' with ' + newBoard[row][i].highlighted)
            }
        }  

        // 3x3 highlighting
        const topLeftRow = Math.floor(row / 3) * 3;
        const topLeftCol = Math.floor(col / 3) * 3;
        
        for (let i = topLeftRow; i < topLeftRow + 3; i++) {
            for (let j = topLeftCol; j < topLeftCol + 3; j++) {
                if (newBoard[i][j].highlighted !== 'spaceNumberTakenInRowOrColumn'){
                    newBoard[i][j].highlighted='spaceHighlightedLookingAt';
                    console.log('Highlighting square at ' + i + ', ' + j + ' as ' + newBoard[i][j].highlighted);
                }
            }
        }
        
        // Check for any matching new data in the given row and column of the cell that was clicked
        for (let i = 0; i < 9; i++){
            for (let j = i + 1; j < 9; j++){
                if (newBoard[row][i].data === newBoard[row][j].data && +newBoard[row][i].data !== 0){
                    newBoard[row][i].highlighted='spaceNumberTakenInRowOrColumn';
                    newBoard[row][j].highlighted='spaceNumberTakenInRowOrColumn';
                }
                if (newBoard[i][col].data === newBoard[j][col].data && +newBoard[row][i].data !== 0){
                    newBoard[i][col].highlighted='spaceNumberTakenInRowOrColumn';
                    newBoard[j][col].highlighted='spaceNumberTakenInRowOrColumn';
                }
            }
        }

        // if the highlight is not a red space
        if (newBoard[row][col].highlighted !== 'spaceNumberTakenInRowOrColumn'){
            newBoard[row][col].highlighted='spaceHighlightedLookingAtSpecific';
        }
        // if the highlight is not due to a backspace
        else if (+newBoard[row][col].data !== 0){
            newBoard[row][col].highlighted='spaceNumberTakenInRowOrColumn';
        }
        // if all else fails, it's just a space you're looking at in the 3x3
        else {
            newBoard[row][col].highlighted='spaceHighlightedLookingAtSpecific';
        }

    } catch (error) {
        console.log(error);
        console.log("fuck");
    }
}

export function Solve(newBoard: SpaceButtonProperties[][]): SpaceButtonProperties[][]{
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            if (!newBoard[i][j].locked){
                newBoard[i][j].highlighted='space';
                newBoard[i][j].data=newBoard[i][j].hiddenData;
            }
        }
    }
    return newBoard;
}

export default SudokuBoard;