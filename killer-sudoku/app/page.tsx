import SudokuBoard from "./Sudoku";

export default function Home() {

	return (
		<div>
			<div>
				<div className="">
					Zachary Wolfe, Drew Mullett, Kevin Belock, Nick Adkins
				</div>
				<div className="killerSudokuTitle">
					Killer Sudoku
				</div>
			</div>
			<SudokuBoard></SudokuBoard>
		</div>
	);
}
