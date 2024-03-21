"use client";

import { solve_sbp, initBoard } from "./Generate";
import SudokuBoard, { Clear, HideBoard, ReApplyBoardState, SaveBoardState } from "./Sudoku";
import React, { useRef, useState } from 'react'
import Timer, { TimerRef } from "./Timer";
export default function Home() {

	const gameOver: boolean = false;
    const used = 0;
    const [panelNum, setPanelNum] = useState(0);
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
                solve_sbp(newBoard);
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
        setPanelNum(num);
        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => row.map(cell => {
                // Only update the unlocked cells with the selected panel number
                return !cell.locked ? { ...cell, data: num.toString() } : cell;
            }));
            return newBoard;
        });
        console.log("Panel Click in set: " + num.toString());
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
