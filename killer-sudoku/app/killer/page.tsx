import React from 'react';
import KillerSudoku from '../KillerSudoku';
export default function Home() {
	return (
		<div>
			<div>
				<div className="killerSudokuNames">
					Zachary Wolfe, Drew Mullett, Kevin Belock, Nick Adkins
				</div>
				<KillerSudoku></KillerSudoku>
			</div>
		</div>
	);
}
