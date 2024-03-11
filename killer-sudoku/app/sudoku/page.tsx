import SudokuBoard from "../Sudoku";
import React from 'react'
export default function Home() {
	return (
		<div>
			<div>
				<div className="killerSudokuNames">
					Zachary Wolfe, Drew Mullett, Kevin Belock, Nick Adkins
				</div>
				<div className="killerSudokuTitle">
					Sudoku
				</div>
                <SudokuBoard></SudokuBoard>
			</div>
		</div>
	);
}
