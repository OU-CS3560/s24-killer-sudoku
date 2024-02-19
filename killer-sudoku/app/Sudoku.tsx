/**
 * @file     Sudoku.tsx
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    An element which generates a 9x9 Sudoku board and handles cell clicks
 * @date     February 18, 2024
 * @version  1.0
*/

"use client"; // for useState variables

import React, { useState } from 'react';

export interface SpaceButtonProperties {
    row: number,
    col: number,
    data: number,
    highlighted?: string
};

const SudokuBoard = () => {
    const [board, setBoard] = useState(() =>{
        return initBoard();
    });

    const handleCellClick = (row: number, col: number) => {
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            handleHighlighting(row, col, newBoard);
            return newBoard;
        });
    };

    return (
        <div className="Main">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} id={rowIndex.toString()}>
                    {row.map((space, columnIndex) => (
                        <div key={columnIndex} id={columnIndex.toString()} className={space.highlighted}>
                            <div onClick={() => handleCellClick(rowIndex, columnIndex)}>{space.row}, {space.col}</div>
                        </div>
                    ))}
                    {rowIndex !== board.length - 1 && <br />}
                </div>
            ))}
        </div>);
};

function initBoard(): SpaceButtonProperties[][]{
    let arr: SpaceButtonProperties[][] = [];

    for (let i = 0; i < 9; i++) {
        arr[i] = [];
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            arr[i][j] = {row: i, col: j, data: (i+j), highlighted: 'space'};
        }
    }

    return arr;
}  

function handleHighlighting(row: number, col: number, newBoard: SpaceButtonProperties[][]){
    for (let j = 0; j < 9; j++)
        for (let k = 0; k < 9; k++)
            newBoard[j][k].highlighted = 'space';
    
    for (let i = 0; i < 9; i++) {
        newBoard[i][col].highlighted = 'spaceHighlighted';
        newBoard[row][i].highlighted = 'spaceHighlighted';
    }    
    try {
        const topLeftRow = Math.floor(row / 3) * 3;
        const topLeftCol = Math.floor(col / 3) * 3;
        
        for (let i = topLeftRow; i < topLeftRow + 3; i++) {
            for (let j = topLeftCol; j < topLeftCol + 3; j++) {
                newBoard[i][j].highlighted='spaceHighlightedLookingAt';
                console.log(`Highlighting square at (${i}, ${j})`);
            }
        }
    } catch (error) {
        console.log(error);
    }
    /*
    if (row + 1 < 9)
        newBoard[row + 1][col].highlighted='spaceHighlightedLookingAt';
    if (row - 1 >= 0)
        newBoard[row - 1][col].highlighted='spaceHighlightedLookingAt';
    if (col + 1 < 9)
        newBoard[row][col + 1].highlighted='spaceHighlightedLookingAt';
    if (col - 1 >= 0)
        newBoard[row][col - 1].highlighted='spaceHighlightedLookingAt';
    if (row + 1 < 9 && col + 1 < 9)
        newBoard[row + 1][col + 1].highlighted='spaceHighlightedLookingAt';
    if (row + 1 < 9 && col - 1 >= 0)
        newBoard[row + 1][col - 1].highlighted='spaceHighlightedLookingAt';
    if (row - 1 >= 0 && col - 1 >= 0)
        newBoard[row - 1][col - 1].highlighted='spaceHighlightedLookingAt';
    if (row - 1 >= 0 && col + 1 < 9)
        newBoard[row - 1][col + 1].highlighted='spaceHighlightedLookingAt';
    */
}

export default SudokuBoard;