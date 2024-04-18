/**
 * @file     Sudoku.tsx
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    An element which generates a 9x9 Sudoku board, handles cell clicks, and relays timer information
 * @date     February 18, 2024
*/

"use client"; // For useState variables

import React, { ChangeEvent } from 'react';
import { TimerRef } from './Timer';
import { SpaceButtonProperties, HandleHighlighting, checkGameOver } from './SudokuFuncs';

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
                                                    {space.topLeftNumber === 0 ? "" : space.topLeftNumber}
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

export default Sudoku;