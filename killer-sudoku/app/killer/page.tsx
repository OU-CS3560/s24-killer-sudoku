import React from 'react';
import KillerSudoku from '../KillerSudoku';
export default function Home() {
	return (
		<div>
			<nav className='navbar'>
				<a href='#'>Classic</a>
				<a href='#'>🏆 Leaderboard</a>
				<a href='#'>Daily</a>
			</nav>
			<div className="killerSudokuNames">
				Zachary Wolfe, Drew Mullett, Kevin Belock, Nick Adkins
			</div>
			<KillerSudoku></KillerSudoku>
		</div>
	);
}
