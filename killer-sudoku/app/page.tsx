"use client"; // Because we're using router and router uses state

import React from "react";
import Sudoku from "./Sudoku";
//import KillerSudoku from "./KillerSudoku";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./ErrorPage";


export default function Home() {
	const router = typeof window !== "undefined" && createBrowserRouter([
		{
			path: "/",
		  	element: <Sudoku></Sudoku>,
			errorElement: <ErrorPage></ErrorPage>,
			/*
			children: [
			{
				path: "killer-sudoku",
				element: <KillerSudoku></KillerSudoku>,
			},
			],
			*/
		}
	  ]);
	return (
		<div>
			<div>
				<div className="killerSudokuNames">
					Zachary Wolfe, Drew Mullett, Kevin Belock, Nick Adkins
				</div>
				{
				router && (
				<RouterProvider router={router} fallbackElement={<React.Fragment>Loading ...</React.Fragment>}>
				</RouterProvider>
				)}
			</div>
		</div>
	);
}