"use client";

import { Solve, initBoard } from "../Generate";
import SudokuBoard, { Clear, HandleHighlighting, HideBoard, ReApplyBoardState, SaveBoardState } from "../Sudoku";
import React, { useRef, useState } from 'react'
import Timer, { TimerRef } from "../Timer";
export default function Home() {

	var gameOver: boolean = false;
    var used = 0;
	const [icon, setIcon] = useState("play_circle");
	const timerRef = useRef<TimerRef>(null);
	const [board, setBoard] = useState(() => {
        return initBoard(used)
    });

	const handleClickSolveButton = () => {
        if (timerRef.current?.getRunning()){
            setBoard(prevBoard => {
                const newBoard = [...prevBoard];
                timerRef.current?.stop();
                setIcon("play_circle");
                Solve(newBoard);
                return newBoard;
            });
        }
    }

	const handleClickStartButton = () => {
        console.log("handling start button");
        if (!timerRef.current?.getRunning()) {
            timerRef.current?.start();
            setIcon("pause_circle");
            setBoard(prevBoard => {
                // Inherit the previous board state
                const newBoard = [...prevBoard];
                ReApplyBoardState(newBoard);
                return newBoard;
            });
        }
    };

	const handleClickStopButton = () => {
        console.log("handling stop button");
        if (timerRef.current?.getRunning()) {
            timerRef.current?.stop(); // Call the stop function from the Timer component
            setIcon("play_circle");
            setBoard(prevBoard => {
                // Inherit the previous board state
                const newBoard = [...prevBoard];
                SaveBoardState(newBoard);
                HideBoard(newBoard);
                return newBoard;
            });
        }
    };

	const handleClickClearButton = () => {
        if (timerRef.current?.getRunning()){
            setBoard(prevBoard => {
                const newBoard = [...prevBoard];
                Clear(newBoard);
                return newBoard;
            });
        }
    }

	const handleClickNewGame = () => {
        setBoard(prevBoard => {
            // Inherit the previous board state
            timerRef.current?.reset();
            return initBoard(used);
        });
    };

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
    }

    const handleClickPanel = (num: number) => {
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            SaveBoardState(newBoard);
            var flag = false;
            var row = 1;
            var col = 1;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (newBoard[i][j].highlighted === 'spaceHighlightedLookingAtSpecific'){
                        row = i;
                        col = j;
                        flag = true;
                        console.log("i: " + i + " j: " + j)
                        break;
                    }
                    else{
                        console.log("i: " + i + " j: " + j + " is not spaceHighlightedLookingAtSpecific" )
                    } 
                }
            }
            if (!newBoard[row][col].locked && flag){
                newBoard[row][col].data = num.toString();
                HandleHighlighting(row, col, newBoard);
                SaveBoardState(newBoard);
            }
            console.log("Panel Click in set: " + num.toString());
            return newBoard;
        });
    }

	return (
		<div>
            <nav className='navbar'>
				<a href='/killer'>Killer</a>
				<a href='#'>🏆 Leaderboard</a>
				<a href='#'>Daily</a>
			</nav>
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
            <div>
                <div className="buttonsContainerTwo">
                    <div className="killerSudokuTitle">
                        Sudoku
                    </div>
                    <div className='timerContainer'>
                        <Timer ref={timerRef}></Timer>
                        <button className="material-symbols-outlined" onClick={icon == "pause_circle" ? () => handleClickStopButton() : () => handleClickStartButton()}>{icon}</button>
                    </div>
                    <div className="boardAndButtons">
                        <div className="buttonsContainer">
                            <div className="spaceLeft">
                                3
                            </div>
                            <div className="spaceTop">
                                4
                            </div>
                            <div className="spaceRight">
                                5
                            </div>
                            <div className="spaceBottom">
                                6
                            </div>
                            <div className="spaceTopLeft">
                                7
                            </div>
                            <div className="spaceTopRight">
                                8
                            </div>
                            <div className="spaceBottomLeft">
                                9
                            </div>
                            <div className="spaceBottomRight">
                                0
                            </div>
                            <div onClick={() => {SaveBoardState(board); handleClickStartButton}}>
                                <SudokuBoard board={board} setBoard={setBoard}></SudokuBoard>
                            </div>
                            <div className="panelConglomerate">
                                <div className="buttonsContainerTwo">
                                    <div className="buttonsContainer">
                                        <button className='solveButton' onClick={() => {handleClickSolveButton()}}>
                                            Solve
                                        </button>
                                        <button className='solveButton' onClick={() => handleClickClearButton()}>
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
		</div>
	);
}
