/**
 * @file     Sudoku.tsx
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    An element which generates a 9x9 Sudoku board and handles cell clicks
 * @date     February 18, 2024
*/

"use client"; // for useState variables

import React, { ChangeEvent, ReactElement, useState } from 'react';

// Defines the 'class' which goes on the board. Just think of this as the properties to a single cell.
export interface SpaceButtonProperties {
    row: number,
    col: number,
    data: string,
    highlighted?: string,
    locked: boolean,
    spaceTakenInRowOrColumn: boolean
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
                
                // If the incoming value doesn't equal the old data and there are no matching cells with this value
                if (+newBoard[row][col].data !== val && !CheckForMatchingRowCol(row, col, newBoard, val)) {

                    // Then Highlight as if it's just a space you're looking at
                    newBoard[row][col].highlighted='spaceHighlightedLookingAtSpecific';

                    // Unhighlight the corresponding row and column that this value is in
                    HighlightForMatchingRowCol(row, col, newBoard, true);
                    console.log('row: ' + row + ', col: ' + col + ' highlighted with: ' + newBoard[row][col].highlighted)
                    newBoard[row][col].spaceTakenInRowOrColumn=false;
                }
                else {
                    newBoard[row][col].highlighted='spaceNumberTakenInRowOrColumnSpecfic';
                    console.log('row: ' + row + ', col: ' + col + ' highlighted with: ' + newBoard[row][col].highlighted)
                    newBoard[row][col].spaceTakenInRowOrColumn=true;
                }

                // Check to see if the old data is the same as the number incoming, if NaN (not a number), and if in bounds of arr
                if (!isNaN(val) && +newBoard[row][col].data !== val && val <= 9 && val >= 0){
                    if (val === 0){ // IMPORTANT: IF YOU ARE PRESSING DELETE ON A CELL, THE INPUT IS SET TO 0 REPEATEDLY, THUS, SET IT TO AN EMPTY VALUE
                        
                        /**
                         * @todo FIX THIS SO THAT NOTHING DISPLAYS IN THE CELL IF THE INPUT IS DELETE OR 0
                         */

                        newBoard[row][col].data = '';
                    }
                    else{
                        newBoard[row][col].data = e.target.value.toString();
                    }
                }
            }
            // This prevents the board from resetting completely when pressing enter
            e.preventDefault();
            return newBoard;
        })
    };

    return (
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
                                onChange={(e) => handleCellClickInput(space.row, space.col, e)} // what to do when clicked
                            />
                        </div>
                    ))}
                    {rowIndex !== board.length - 1 && <br />}
                </div> // This is so that after every 9 squares generated a break tag is inserted
            ))}
        </div>);
};

/**
 * @brief Initializes the board to be a 2d array, generates a board full of data with SpaceButtonProperties, and highlights the origin to start.
 * @returns A 9x9 board
 */
function initBoard(): SpaceButtonProperties[][] {
    let arr: SpaceButtonProperties[][] = [];

    // Don't change unless better solution, need to fill the initial columns with a row vector.
    for (let i = 0; i < 9; i++) {
        arr[i] = [];
    }

    // Generation loop
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            arr[i][j] = {row: i, col: j, data: (i+j).toString(), highlighted: 'space', locked: false, spaceTakenInRowOrColumn: false};
            arr[i][j].data='8';
        }
    }

    // Initially highlight the board at the origin
    HandleHighlighting(4, 4, arr);
    arr[3][3].locked=true;
    return arr;
}  

/**
 * @brief Checks if the corresponding row and column has any matching data to the current input
 * @param row - the row of the cell that was clicked
 * @param col - the column of the cell that was clicked
 * @param newBoard - the board we want to change
 * @param target - the value which we are searching for
 * @returns true if matches, false if no matches
 */
function CheckForMatchingRowCol(row: number, col: number, newBoard: SpaceButtonProperties[][], target: number): boolean{
    // Check for any matching data before placing the value and mark it as taken in that row or column
    let deez = false;
    for (let i = 0; i < 9; i++){
        if ((target && newBoard[i][col].data === target.toString() && !newBoard[i][col].locked) || (newBoard[row][i].data === target.toString() && !newBoard[row][i].locked)){
            deez = true;
        }
    }
    if (deez)
        HighlightForMatchingRowCol(row, col, newBoard);

    return deez;
}

/**
 * @brief A function that highlights the matches in the corresponding row and column of the cell that was clicked, can also unhighlight
 * @param row - the row of the cell that was clicked
 * @param col - the column of the cell that was clicked
 * @param newBoard - the board we want to change
 * @param unhighlight - optional boolean to unhighlight the corresponding row and column of the cell that was clicked
 */
function HighlightForMatchingRowCol(row: number, col: number, newBoard: SpaceButtonProperties[][], unhighlight?: boolean): void{
    for (let i = 0; i < 9; i++){
        if (i !== row && !newBoard[i][col].locked){
            if (unhighlight){
                newBoard[i][col].highlighted='spaceHighlighted';
                newBoard[i][col].spaceTakenInRowOrColumn=false;
            }
            else{
                newBoard[i][col].highlighted='spaceNumberTakenInRowOrColumn';
                newBoard[i][col].spaceTakenInRowOrColumn=true;
            }
            console.log('highlighting with ' + newBoard[i][col].highlighted);
        }
        if (i !== col && !newBoard[i][col].locked){
            if (unhighlight){
                newBoard[row][i].highlighted='spaceHighlighted';
                newBoard[row][i].spaceTakenInRowOrColumn=false;
            }
            else{
                newBoard[row][i].highlighted='spaceNumberTakenInRowOrColumn';
                newBoard[row][i].spaceTakenInRowOrColumn=true;
            }
            console.log('highlighting with ' + newBoard[row][i].highlighted);
        }
    }
}

/**
 * @brief A function that handles row and column highlights as well as 3x3 highlighting
 * @param row - the row of the cell that was clicked
 * @param col - the column of the cell that was clicked
 * @param newBoard - the board we want to change
 */
function HandleHighlighting(row: number, col: number, newBoard: SpaceButtonProperties[][]){
    try {
        // Clear any current highlights
        for (let j = 0; j < 9; j++){
            for (let k = 0; k < 9; k++){
                if (!newBoard[j][k].spaceTakenInRowOrColumn){
                    newBoard[j][k].highlighted='space';
                }
                else {
                    newBoard[j][k].highlighted='spaceNumberTakenInRowOrColumn';
                }
                console.log('j: ' + j + ', k: ' + k + ' highlighted with: ' + newBoard[j][k].highlighted)
            }
        }
        // Change the corresponding row and column to be highlighted
        for (let i = 0; i < 9; i++) {
            if (i !== row && !newBoard[i][col].spaceTakenInRowOrColumn){
                newBoard[i][col].highlighted = 'spaceHighlighted';
            }
            else{
                newBoard[i][col].highlighted='spaceNumberTakenInRowOrColumn';
            }
            console.log('highlighting [i][col] ' + i + ', ' + col + ' with ' + newBoard[i][col].spaceTakenInRowOrColumn)
            if (i !== col && !newBoard[row][i].spaceTakenInRowOrColumn){
                newBoard[row][i].highlighted = 'spaceHighlighted';
            }
            else{
                newBoard[row][i].highlighted='spaceNumberTakenInRowOrColumn';
            }
            console.log('highlighting  [row][i] ' + row + ', ' + i + ' with ' + newBoard[row][i].spaceTakenInRowOrColumn)
        }  
        const topLeftRow = Math.floor(row / 3) * 3;
        const topLeftCol = Math.floor(col / 3) * 3;
        
        for (let i = topLeftRow; i < topLeftRow + 3; i++) {
            for (let j = topLeftCol; j < topLeftCol + 3; j++) {
                if ((i !== row || j !== col) && !newBoard[i][j].spaceTakenInRowOrColumn){
                    newBoard[i][j].highlighted='spaceHighlightedLookingAt';
                    console.log('Highlighting square at ' + i + ', ' + j);
                }
                else if (newBoard[i][j].spaceTakenInRowOrColumn){
                    newBoard[i][j].highlighted='spaceNumberTakenInRowOrColumn';
                    console.log('Highlighting square at ' + i + ', ' + j + ' as ' + newBoard[i][j].spaceTakenInRowOrColumn);
                }
            }
        }
        if (!newBoard[row][col].spaceTakenInRowOrColumn)
            newBoard[row][col].highlighted='spaceHighlightedLookingAtSpecific';
        else
            newBoard[row][col].highlighted='spaceNumberTakenInRowOrColumn';

        newBoard[3][3].locked=true;
    } catch (error) {
        console.log(error);
        console.log("fuck");
    }
}

export default SudokuBoard;