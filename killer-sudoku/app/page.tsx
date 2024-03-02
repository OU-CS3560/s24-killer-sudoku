import SudokuBoard from "./Sudoku";
// import { Timer } from "./Timer"
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
