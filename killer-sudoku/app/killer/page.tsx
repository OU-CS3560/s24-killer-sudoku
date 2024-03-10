import React from 'react';
import SudokuBoard from "../Sudoku";
export default function Home() {

	return (
		<div>
			<div>
				<div className="killerSudokuNames">
					Zachary Wolfe, Drew Mullett, Kevin Belock, Nick Adkins
				</div>
				<div className="killerSudokuTitle">
					Killer Sudoku
				</div>
				<SudokuBoard></SudokuBoard>
			</div>
		</div>
	);
}
