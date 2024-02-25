/**
 * @file     Sudoku.tsx
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    An element which generates a 9x9 Sudoku board and handles cell clicks
 * @date     February 18, 2024
 * @version  1.0
*/

"use client"; // for useState variables

import React, { ChangeEvent, ReactElement, useState } from 'react';

export interface SpaceButtonProperties {
    row: number,
    col: number,
    data: number,
    highlighted?: string
    locked: boolean
};

const SudokuBoard = () => {
    const [board, setBoard] = useState(() => {
        return initBoard();
    });

    const [data, setData] = useState(Number);

    const handleCellClickHighlight = (row: number, col: number) => {
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            handleHighlighting(row, col, newBoard);
            return newBoard;
        });
    };

    const handleCellClickInput = (row: number, col: number, e: ChangeEvent<HTMLInputElement>) => {
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            if (!newBoard[row][col].locked){
                let val = +e.target.value;
                if (!isNaN(val) && newBoard[row][col].data !== val && val <= 9 && val >= 0){
                    newBoard[row][col].data = +e.target.value;
                }
            }
            e.preventDefault();
            return newBoard;
        })
    };

    return (
        <div className="Main">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} id={rowIndex.toString()}>
                    {row.map((space, columnIndex) => (
                        <div key={columnIndex} id={columnIndex.toString()} onClick={() => handleCellClickHighlight(rowIndex, columnIndex)}>
                            <input
                                type='text'
                                autoComplete='off'
                                autoCapitalize='off'
                                value={space.data}
                                className={space.highlighted}
                                onChange={(e) => handleCellClickInput(space.row, space.col, e)}
                            />
                        </div>
                    ))}
                    {rowIndex !== board.length - 1 && <br />}
                </div> // This is so that after every 9 squares generated a break tag is inserted
            ))}
        </div>);
};

function initBoard(): SpaceButtonProperties[][] {
    let arr: SpaceButtonProperties[][] = [];

    for (let i = 0; i < 9; i++) {
        arr[i] = [];
    }

    // Generation loop
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            arr[i][j] = {row: i, col: j, data: (i+j), highlighted: 'space', locked: true};
            arr[i][j].data=10;
        }
    }

    handleHighlighting(4, 4, arr);
    return arr;
}  

function handleHighlighting(row: number, col: number, newBoard: SpaceButtonProperties[][]){
    try {
        // Clear any current highlights
        for (let j = 0; j < 9; j++)
            for (let k = 0; k < 9; k++)
                newBoard[j][k].highlighted='space';
        
        // Change the corresponding row and column to be highlighted
        for (let i = 0; i < 9; i++) {
            if (i !== row)
                newBoard[i][col].highlighted = 'spaceHighlighted';

            if (i !== col)
                newBoard[row][i].highlighted = 'spaceHighlighted';
        }    
        const topLeftRow = Math.floor(row / 3) * 3;
        const topLeftCol = Math.floor(col / 3) * 3;
        
        for (let i = topLeftRow; i < topLeftRow + 3; i++) {
            for (let j = topLeftCol; j < topLeftCol + 3; j++) {
                if (i !== row || j !== col){
                    newBoard[i][j].highlighted='spaceHighlightedLookingAt';
                    console.log('Highlighting square at ' + i + ', ' + j);
                }
            }
        }

        newBoard[row][col].highlighted='spaceHighlightedLookingAtSpecific';
    } catch (error) {
        console.log(error);
        console.log("fuck");
    }
}

export default SudokuBoard;