/**
 * @file     page.tsx
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    A file to organize all elements necessary to function as a proper Sudoku
 * @date     March 13, 2024
*/

"use client";

import Timer, { TimerRef } from "../Timer";
import React, { useRef, useState } from 'react'
import { solve_sbp, initBoard } from "../Generate";
import SudokuBoard, { Clear, HandleHighlighting, HideBoard, ReApplyBoardState, SaveBoardState } from "../Sudoku";
export default function Home() {

	// var gameOver: boolean = false;
    var used = 0;

    // A useState for the icon of the Timer
	const [icon, setIcon] = useState("play_circle");

    const [gameOver, setGameOver] = useState(false);
    
    // A useState to access methods of the Timer
	const timerRef = useRef<TimerRef>(null);

    // A useState to modify the board throughout the state of the game
	const [board, setBoard] = useState(() => {
        console.log("rendered");
        return initBoard(false, used)
    });

    // A function to handle when the user clicks the solve button
	const handleClickSolveButton = () => {
        if (!gameOver){
            setGameOver(true);
            // If the Timer exists and is running
            if (timerRef.current?.getRunning()){

                // Stop the Timer
                timerRef.current?.stop();
                setIcon("play_circle");

                setBoard(prevBoard => {
                    
                    // Inherit the previous board state
                    const newBoard = [...prevBoard];
                    timerRef.current?.stop();
                    Clear(newBoard);
                    solve_sbp(newBoard);
                    HandleHighlighting(4, 4, newBoard);
                    return newBoard;
                });
            }
        }
    }

    // A function to handle when the user clicks on the Timer's icon
	const handleClickStartButton = () => {
        if (!gameOver){
            console.log("handling start button");

            // If the Timer exists and ISN'T running (so we can start it)
            if (!timerRef.current?.getRunning()) {

                // Start the Timer
                timerRef.current?.start();
                setIcon("pause_circle");

                setBoard(prevBoard => {

                    // Inherit the previous board state
                    const newBoard = [...prevBoard];
                    
                    // Apply the board state that was hidden from the user
                    ReApplyBoardState(newBoard);
                    
                    return newBoard;
                });
            }
        }
    };

    // A function to handle when the user clicks on the Timer's icon
	const handleClickStopButton = () => {
        if (!gameOver){
            console.log("handling stop button");

            // If the Timer exists and IS running (so we can stop it)
            if (timerRef.current?.getRunning()) {

                // Stop the Timer
                timerRef.current?.stop(); 
                setIcon("play_circle");

                setBoard(prevBoard => {

                    // Inherit the previous board state
                    const newBoard = [...prevBoard];

                    // Save the current board state to be able to hide it from the user
                    SaveBoardState(newBoard);

                    // Hide the board
                    HideBoard(newBoard);
                    return newBoard;
                });
            }
        }
    };

    // A function to handle when the user clicks Clear
	const handleClickClearButton = () => {
        if (!gameOver){
            console.log("Clear button pressed");
            if (timerRef.current?.getRunning()){
                timerRef.current?.reset();
                setBoard(prevBoard => {

                    // Inherit the previous board state
                    const newBoard = [...prevBoard];

                    // Save the current board state to be able to hide it from the user
                    
                    // Clear the board (except locked cells) and highlight at the origin of the board
                    Clear(newBoard);
                    SaveBoardState(newBoard);
                    
                    return newBoard;
                });
            }
        }
    }

    // A function to handle when the user clicks New Game
	const handleClickNewGame = () => {
        // Reset the Time the user has accumulated
        timerRef.current?.reset();

        setIcon("pause_circle");
        setBoard(initBoard(false, used));
    };

    // A function to handle when the user selects a new difficulty
	const handleClickDifficultyButton = (buttonName: string) => {
        console.log(buttonName, " Killer Sudoku puzzle requested");
        alert("Making GET request to http://localhost3000/?difficulty=" + buttonName);
        fetch("http://localhost3000/difficulty/?difficulty=" + buttonName)
            .then(response => response.json())
            .then(data => {
                // Handle the retrieved data
                console.log(data);
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });

        // Have something passed to generation algorithm
    }

    // A function to handle when the user presses on the panel off to the right-hand side of the board
    const handleClickPanel = (num: number) => {
        if (!gameOver){
            setBoard(prevBoard => {
                const newBoard = [...prevBoard];

                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {

                        /******************************************
                         Same algorithm as handleCellClickInput
                        ******************************************/
                    
                        if (!newBoard[i][j].locked && newBoard[i][j].marked) {
                            // Cast target to int, because it's incoming as a string
                            let val = num;
                            
                            if (val === 0) { // IMPORTANT: IF YOU ARE PRESSING DELETE (erase) ON A CELL, THE INPUT IS SET TO 0 REPEATEDLY, THUS, SET IT TO AN EMPTY VALUE
                                val = +newBoard[i][j].data;
                                newBoard[i][j].data = '';
                            }
                            else {
                                val = +newBoard[i][j].data;
                                newBoard[i][j].data = num.toString();
                            }
                            HandleHighlighting(i, j, newBoard, val);
                            SaveBoardState(newBoard);
                            break;
                            // console.log(used);
                        }
                    }
                }
                console.log("Panel Click in set: " + num.toString());
                return newBoard;
            });
        }
    }

	return (
		<div>
            <link rel="stylesheet" href="globals.css"></link>
            <div className="buttonsContainerNavbar">
                <div className="percent_33">
                    <p>Sudoku.DrewMullett.net</p>
                </div>
                <div className="navbar">
                    <a href='/'>Killer</a>
                    <a href='#'>Leaderboard</a>
                    {/* /leaderboard */}
                    <a href='#'>Daily</a>
                    {/* /daily */}
                </div>
                <div className="percent_33">
                    {/* Avatar */}
                </div>
            </div>
            <hr className="solid"></hr>
            <div className="killerSudokuNames">
                Zachary Wolfe, Drew Mullett, Kevin Belock, Nick Adkins
            </div>
            <div className='buttonsContainer'>
                Difficulty:
                <button name='Easy' className='difficultyButton' onClick={() => handleClickDifficultyButton("Easy")}>
                    Easy
                </button>
                <button name='Medium' className='difficultyButton' onClick={() => handleClickDifficultyButton("Medium")}>
                    Medium
                </button>
                <button name='Hard' className='difficultyButton' onClick={() => handleClickDifficultyButton("Hard")}>
                    Hard
                </button>
                <button name='Expert' className='difficultyButton' onClick={() => handleClickDifficultyButton("Expert")}>
                    Expert
                </button>
            </div>
            <div className="mainContent">
                <div className="killerSudokuTitle">
                    Sudoku
                </div>
                <div className='timerContainer'>
                    <Timer ref={timerRef}></Timer>
                    {/* eslint-disable-next-line */}
                    <button className="material-symbols-outlined" onClick={icon == "pause_circle" ? () => handleClickStopButton() : () => handleClickStartButton()}>{icon}</button>
                </div>
                <div className="boardAndButtons">
                    <div className="buttonsContainer">
                        <div className="removeall">
                            <div className="spaceLeft">3</div>
                            <div className="spaceTop">4</div>
                            <div className="spaceRight">5</div>
                            <div className="spaceBottom">6</div>
                            <div className="spaceTopLeft">7</div>
                            <div className="spaceTopRight">8</div>
                            <div className="spaceBottomLeft">9</div>
                            <div className="spaceBottomRight">0</div>
                        </div>
                        <div onClick={() => {handleClickStartButton(); SaveBoardState(board)}}>
                            <SudokuBoard board={board} setBoard={setBoard} setGameState={setGameOver} gameOver={gameOver} timerRef={timerRef} setIcon={setIcon}></SudokuBoard>
                        </div>
                        <div className="panelConglomerate">
                            <div className="buttonsContainerTwo">
                                <div className="buttonsContainer">
                                    <button className='solveButton' onClick={() => {handleClickSolveButton()}}>
                                        Solve
                                    </button>
                                    <button className='solveButton' onClick={() => {handleClickClearButton()}}>
                                        Clear
                                    </button>
                                </div>
                                <div className="buttonsContainer">
                                    <button onClick={() => handleClickPanel(1)} className="numberPanel">1</button>
                                    <button onClick={() => handleClickPanel(2)} className="numberPanel">2</button>
                                    <button onClick={() => handleClickPanel(3)} className="numberPanel">3</button>
                                </div>
                                <div className="buttonsContainer">
                                    <button onClick={() => handleClickPanel(4)} className="numberPanel">4</button>
                                    <button onClick={() => handleClickPanel(5)} className="numberPanel">5</button>
                                    <button onClick={() => handleClickPanel(6)} className="numberPanel">6</button>
                                </div>
                                <div className="buttonsContainer">
                                    <button onClick={() => handleClickPanel(7)} className="numberPanel">7</button>
                                    <button onClick={() => handleClickPanel(8)} className="numberPanel">8</button>
                                    <button onClick={() => handleClickPanel(9)} className="numberPanel">9</button>
                                </div>
                                <button className='newGame' onClick={() => handleClickNewGame()}>
                                    New Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	);
}
