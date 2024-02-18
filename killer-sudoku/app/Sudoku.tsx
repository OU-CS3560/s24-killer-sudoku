import { Space } from "./Space";

export class Sudoku {
    private spaces: Space[][] = [];

    private UI: any;
        setUI(UI: any): void{this.UI = UI;}
        getUI(): any{return this.UI;}

    constructor() {
        //Initialize each column with a row array
        for (let i = 0; i < 9; i++) {
            this.spaces[i] = [];
        }

        //Initialize each Array index to be a new Space with the row, col, and data
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.spaces[i][j] = new Space(j, i, (i + j)); //Inverted row/col because of the way that the array was initialized
            }
        }

        this.UI = 
        (<div className="Main">
            {this.spaces.map((row, rowIndex) => (
                <div key={rowIndex} id={rowIndex.toString()}>
                    {row.map((space, columnIndex) => (
                        <div key={columnIndex} id={columnIndex.toString()}>
                            {space.getUI()}
                        </div>
                    ))}
                    {rowIndex !== this.spaces.length - 1 && <br />}
                </div>
            ))}
        </div>);
    }    

    highlightSquares_Row_Col(space: Space){
        for (let i = 0; i < 9; i++) {
            this.spaces[i][space.getCol()].setHighlighted();
            this.spaces[space.getRow()][i].setHighlighted();
        }
    }
}