/**
 * @file     SudokuFuncs.ts
 * @author   WIP
 * @brief    (WIP)
 * @date     April 16, 2024
*/

// Defines the 'class' which goes on the board. Just think of this as the properties to a single cell.
export interface SpaceButtonProperties {
    data: string,
    highlighted: string,
    savedData: string,
    hiddenData: string,
    fixedStatus: string,
    mutableStatus: string,
    locked: boolean,
    previousHighlight: string,
    marked: boolean,
    topLeftNumber: number,
};

export function checkGameOver(newBoard: SpaceButtonProperties[][]): boolean{
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            if (newBoard[i][j].data !== newBoard[i][j].hiddenData){
                console.log("CHECK GAME OVER FALSE");
                return false;
            }
        }
    }
    console.log("CHECK GAME OVER TRUE");
    return true;
}

/**
 * @brief A function that handles row and column highlights as well as 3x3 highlighting
 * @param row - the row of the cell that was clicked
 * @param col - the column of the cell that was clicked
 * @param newBoard - the board we want to change
 */
export function HandleHighlighting(row: number, col: number, newBoard: SpaceButtonProperties[][], justPaused: boolean, difNum?: number) {
    if (!justPaused){
        try {
            // Clear the board of highlights
            for (let j = 0; j < 9; j++) {
                for (let k = 0; k < 9; k++) {
                    if (newBoard[j][k].highlighted !== 'spaceNumberTaken') {
                        newBoard[j][k].previousHighlight = newBoard[j][k].highlighted;
                        newBoard[j][k].highlighted = 'space'
                     //   console.log('j: ' + j + ', k: ' + k + ' highlighted with: ' + newBoard[j][k].highlighted);
                    }
    
                    if (newBoard[j][k].marked){
                        newBoard[j][k].marked = false;
                    }
                }
            }
    
            // Change the corresponding row and column to be highlighted
            for (let i = 0; i < 9; i++) {
                if (i !== row && newBoard[i][col].highlighted !== 'spaceNumberTaken') {
                    newBoard[i][col].previousHighlight = newBoard[i][col].highlighted;
                    newBoard[i][col].highlighted = 'spaceHighlighted';
                    console.log('1 highlighting [i][col] ' + i + ', ' + col + ' with ' + newBoard[i][col].highlighted);
                }
                if (i !== col && newBoard[row][i].highlighted !== 'spaceNumberTaken') {
                    newBoard[row][i].previousHighlight = newBoard[row][i].highlighted;
                    newBoard[row][i].highlighted = 'spaceHighlighted';
                    console.log('1 highlighting  [row][i] ' + row + ', ' + i + ' with ' + newBoard[row][i].highlighted);
                }
            }
    
            // If the old value on the board is defined (if we passed it as a parameter to this function)
            // Clear any previous highlights that this number once shared with matching data in this row or column or 3x3
            if (difNum) {
                console.log("difNum: " + difNum);
                for (let i = 0; i < 9; i++) {
                    if (newBoard[row][i].highlighted === 'spaceNumberTaken' && +newBoard[row][i].data === difNum && i !== col && doesntHaveRowColumnMatching(row, i, newBoard)) {
                        newBoard[row][i].previousHighlight = newBoard[row][i].highlighted;
                        newBoard[row][i].highlighted = 'spaceHighlighted';
                        console.log('highlighting [row][i] ' + row + ', ' + i + ' with ' + newBoard[row][i].highlighted);
                    }
                    if (newBoard[i][col].highlighted === 'spaceNumberTaken' && +newBoard[i][col].data === difNum && i !== row && doesntHaveRowColumnMatching(i, col, newBoard)) {
                        newBoard[i][col].previousHighlight = newBoard[i][col].highlighted;
                        newBoard[i][col].highlighted = 'spaceHighlighted';
                        console.log('2 highlighting [i][col] ' + i + ', ' + col + ' with ' + newBoard[i][col].highlighted);
                    }
                }
                const topLeftRow = Math.floor(row / 3) * 3;
                const topLeftCol = Math.floor(col / 3) * 3;
    
                for (let i = topLeftRow; i < topLeftRow + 3; i++) {
                    for (let j = topLeftCol; j < topLeftCol + 3; j++) {
                        if (newBoard[i][j].highlighted === 'spaceNumberTaken' && +newBoard[i][j].data === difNum && i !== row && j !== col && doesntHaveRowColumnMatching(i, j, newBoard)) {
                            newBoard[i][j].previousHighlight = newBoard[i][j].highlighted;
                            newBoard[i][j].highlighted = 'spaceHighlighted';
                            console.log('Highlighting square at ' + i + ', ' + j + ' as ' + newBoard[i][j].highlighted);
                        }
                    }
                }
            }
    
            // Check for any new matching data in the given 3x3 matrix of the cell that was clicked
            const topLeftRow = Math.floor(row / 3) * 3;
            const topLeftCol = Math.floor(col / 3) * 3;
    
            for (let i = topLeftRow; i < topLeftRow + 3; i++) {
                for (let j = topLeftCol; j < topLeftCol + 3; j++) {
                    if (newBoard[i][j].highlighted !== 'spaceNumberTaken') {
                        newBoard[i][j].previousHighlight = newBoard[i][j].highlighted;
                        newBoard[i][j].highlighted = 'spaceHighlightedLookingAt';
                        console.log('consttopleft Highlighting square at ' + i + ', ' + j + ' as ' + newBoard[i][j].highlighted);
                    }
                    if (newBoard[row][col].data === newBoard[i][j].data && i !== row && j !== col && newBoard[i][j].data !== '') {
                        newBoard[i][j].previousHighlight = newBoard[i][j].highlighted
                        newBoard[i][j].highlighted = 'spaceNumberTaken';
                        newBoard[row][col].previousHighlight = newBoard[row][col].highlighted;
                        newBoard[row][col].highlighted = 'spaceNumberTaken';
                        console.log('consttopleft Highlighting square at ' + i + ', ' + j + ' as ' + newBoard[i][j].highlighted);
                    }
                }
            }
    
            // Check for any new matching data in the given row and column of the cell that was clicked
            for (let i = 0; i < 9; i++) {
                for (let j = i + 1; j < 9; j++) {
                    if (newBoard[row][i].data === newBoard[row][j].data && newBoard[row][i].data !== '') {
                        newBoard[row][i].previousHighlight = newBoard[row][i].highlighted;
                        newBoard[row][j].previousHighlight = newBoard[row][j].highlighted;
                        newBoard[row][i].highlighted = 'spaceNumberTaken';
                        newBoard[row][j].highlighted = 'spaceNumberTaken';
                        console.log('highlighting [row][i] ' + row + ', ' + i + ' with ' + newBoard[row][i].highlighted);
                        console.log('highlighting [row][j] ' + row + ', ' + j + ' with ' + newBoard[row][j].highlighted);
                    }
                    if (newBoard[i][col].data === newBoard[j][col].data && newBoard[i][col].data !== '') {
                        newBoard[i][col].previousHighlight = newBoard[i][col].highlighted;
                        newBoard[j][col].previousHighlight = newBoard[j][col].highlighted;
                        newBoard[i][col].highlighted = 'spaceNumberTaken';
                        newBoard[j][col].highlighted = 'spaceNumberTaken';
                        console.log('3 highlighting [i][col] ' + i + ', ' + col + ' with ' + newBoard[i][col].highlighted);
                        console.log('highlighting [j][col] ' + j + ', ' + col + ' with ' + newBoard[j][col].highlighted);
                    }
                }
            }
    
            // if the highlight is not a red space
            if (newBoard[row][col].highlighted !== 'spaceNumberTaken' || newBoard[row][col].data === '' || doesntHaveRowColumnMatching(row, col, newBoard)) {
                newBoard[row][col].previousHighlight = newBoard[row][col].highlighted;
                newBoard[row][col].highlighted = 'spaceHighlightedLookingAtSpecific';
                console.log('highlighting [row][col] ' + row + ', ' + col + ' with ' + newBoard[row][col].highlighted);
            }
            else {
                newBoard[row][col].previousHighlight = newBoard[row][col].highlighted;
                console.log ("BEFORE HIGHLIGHTING ROW COL 2 " + newBoard[row][col].highlighted);
                newBoard[row][col].highlighted = 'spaceNumberTaken';
                console.log('highlighting [row][col] ' + row + ', ' + col + ' with ' + newBoard[row][col].highlighted);
            }
    
            newBoard[row][col].marked = true;
        } catch (error) {
            console.log(error);
            console.log("fuck");
        }
    }
}

export function Clear(newBoard: SpaceButtonProperties[][]) {
    console.log("user clicked clear button");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            newBoard[i][j].previousHighlight = 'space';
            newBoard[i][j].highlighted='space';
            if (!newBoard[i][j].locked) {
                newBoard[i][j].data='';
            }
        }
    }
    HandleHighlighting(4, 4, newBoard, false);
}

export function HideBoard(newBoard: SpaceButtonProperties[][]) {
    console.log("hide board");
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            newBoard[i][j].highlighted = 'space';
            newBoard[i][j].data = '';
        }
    }
}

export function SaveBoardState(newBoard: SpaceButtonProperties[][]) {
    console.log("save board state");
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            newBoard[i][j].previousHighlight = newBoard[i][j].highlighted;
            newBoard[i][j].savedData = newBoard[i][j].data;
        }
    }
}

export function ReApplyBoardState(newBoard: SpaceButtonProperties[][]){
    console.log("reapply board")
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            newBoard[i][j].highlighted = newBoard[i][j].previousHighlight;
            newBoard[i][j].data = newBoard[i][j].savedData;
        }
    }
}

/*
function checkGameOver(newBoard: SpaceButtonProperties[][]): boolean{
    console.log('checkGameOver');
    let correct = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (newBoard[i][j].data === newBoard[i][j].hiddenData) {
                correct++;
            }
        }
    }
    if (correct === 80) {
        return true;
    }
    else {
        return false;
    }
}
*/
/**
 * @brief A function that returns true if the given row and column doesn't have data matching in this row or column
 * @param row 
 * @param col 
 * @param newBoard 
 * @returns 
 */
export function doesntHaveRowColumnMatching(row: number, col: number, newBoard: SpaceButtonProperties[][]): boolean {
    for (let i = 0; i < 9; i++) {
        if (i !== col && newBoard[row][i].data === newBoard[row][col].data && newBoard[row][i].data !== '') {
            return false;
        }
        if (i !== row && newBoard[i][col].data === newBoard[row][col].data && newBoard[i][col].data !== '') {
            return false;
        }
    }

    const topLeftRow = Math.floor(row / 3) * 3;
    const topLeftCol = Math.floor(col / 3) * 3;

    for (let i = topLeftRow; i < topLeftRow + 3; i++) {
        for (let j = topLeftCol; j < topLeftCol + 3; j++) {
            if (newBoard[row][col].data === newBoard[i][j].data && !(i === row || j === col) && newBoard[i][j].data !== '') {
                return false;
            }
        }
    }

    return true;
}