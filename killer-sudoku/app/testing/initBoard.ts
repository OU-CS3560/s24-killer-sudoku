interface SpaceButtonProperties {
    data: string,
    highlighted: string,
    savedData: string,
    hiddenData: string,
    fixedStatus: string,
    mutableStatus: string,
    locked: boolean,
    previousHighlight: string,
    marked: boolean,
    topleftnumber: number,
};

type genBoardType = {
    tile: number[][], note: boolean[][][], occ: number, state: boolean
};

const kKey: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function initBoard(killer: boolean, used: number): SpaceButtonProperties[][] {

    console.log("initBoard: Start");

    let iter: number = 0;

    const generate = (board: genBoardType): boolean => {
        if (iter++ > 50) {iter = 0; return true;}
        
        //Calls solver & records all changes it made
        const changes: [number,number][] = solve_gen(board,2);
        if (board.state) {
            if (board.occ == 81) return true;

            let x: number = 0, y: number = 0;
            do {
                x = rand(0,8);
                y = rand(0,8);
            } while (board.tile[x][y] != 0);

            //Look through every available option
            for (let val of randomOptions(board.note[x][y])) { 
                boardAdd(board,val,x,y);
                if (generate(board)) return true;
                boardRem(board,x,y);
            }
        }

        //If board is unsolvable, undo all solver changes & return false
        for (let ch of changes) boardRem(board,ch[0],ch[1]);
        board.state = true;
        return false;
    }

    let board: genBoardType = makeBoard();
    do {
        board = makeBoard();
        generate(board);
    } while (!isValid(board));

    console.log("initBoard: Randomization complete");

    // Eventually have this value come from a UI element, instead of being defined here
    const difficulty: string = "Medium";

    // Also feel free to change around these difficulty values a bit
    // The number signifies how many tiles (out of 81) are shown at start
    const diffMap = new Map<string,number> ([
        ["Easy"    , 37],
        ["Medium"  , 31],
        ["Hard"    , 23],
        ["Expert"  , 17],
        ["K-Easy"  , 31],
        ["K-Medium", 25],
        ["K-Hard"  , 10],
        ["K-Expert", 0 ]
    ]);

    // for weird looking operator "??" look up "Nullish coalescing operator"
    // basically returns left value as long as it's not null or undefined, otherwise returns right
    const numShown: number = diffMap.get(difficulty) ?? 81; //81 is default in case something goes wrong

    console.log(`initBoard: Difficulty: ${difficulty}. numShown: ${numShown}`);

    // Showing Tiles
    let shown: genBoardType = makeBoard(), temp: genBoardType = makeBoard();
    while (!isValid(temp)) {
        shown = makeBoard(); temp = makeBoard();
        for (let i = 0; i < numShown; i++) {
            let x: number = 0, y: number = 0;
            do {
                x = rand(0,8); y = rand(0,8);
            } while (shown.tile[x][y] != 0)
            boardAdd(shown,board.tile[x][y],x,y);
            /**
             * @todo FIX THIS SO THAT USED GETS INCREMENTED CORRECTLY THROUGHOUT RUNTIME
            used++;
            * i changed everything surrounding this code here, just FYI - Nick
            */
        }
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                temp.tile[x][y] = shown.tile[x][y];
                for (let n = 1; n <= 9; n++) {
                    temp.note[x][y][n] = shown.note[x][y][n];
                }
            }
        }
        temp.occ = shown.occ; temp.state = shown.state;
        solve_gen(temp,2);
    }

    console.log("initBoard: Tile showing complete");

    let kBoard: kTile[][] = [];
    if (killer) kBoard = genKiller(board.tile);

    // Initialization Loop, load all values onto the board's data
    let arr: SpaceButtonProperties[][] = [];
    for (let x = 0; x < 9; x++) {
        arr[x] = [];
        for (let y = 0; y < 9; y++) {
            const tile = toStr(shown.tile[x][y]);
            const hidd = toStr(board.tile[x][y]);
            arr[x][y] = {
                data: tile,
                highlighted: 'space',
                savedData: tile,
                hiddenData: hidd,
                fixedStatus: '',
                mutableStatus: '',
                locked: (tile != ''), // <-- Lock the tile if it's not blank
                previousHighlight: 'space',
                marked: false,
                topleftnumber: 0,
            };
        }
    }

    console.log("initBoard: Initialization complete");

    // Initially highlight the board at the origin
    initBoardBoldLines(arr, kBoard, killer);
    HandleHighlighting(4, 4, arr, false);
    SaveBoardState(arr);
    return arr;
}

function initBoardBoldLines(newBoard: SpaceButtonProperties[][], kBoard: kTile[][], yesorno: boolean): void {
    /*Init fixed status for the bolded border outlines */
    for (let i = 0; i < 9; i++){
        newBoard[i][0].fixedStatus='Top';
        newBoard[0][i].fixedStatus='Left';        

        newBoard[i][3].fixedStatus='Top';
        newBoard[3][i].fixedStatus='Left';

        newBoard[i][6].fixedStatus='Top';
        newBoard[6][i].fixedStatus='Left';

        newBoard[i][8].fixedStatus='Bottom';
        newBoard[8][i].fixedStatus='Right';
    }
    for (let i = 0; i < 9; i += 3){
        for (let j = 0; j < 9; j += 3){
            newBoard[i][j].fixedStatus='TopLeft'
        }
    }
    for (let i = 0; i <= 6; i += 3){
        newBoard[i][8].fixedStatus='BottomLeft';
        newBoard[8][i].fixedStatus='TopRight';
    }
    newBoard[8][8].fixedStatus='BottomRight';

    /* START OF MUTABLE BORDER ALGORITHM 

    // random number hash for identifier, boolean for visited
    let mapping = new Map<number, boolean>();

    switch(percentage){

        //no default case because its defined in a range of 1-100
    }
    */
    if (kBoard.length == 0) { //if no killer groups, ignore dashed borders & return
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (yesorno){
                    newBoard[x][y].mutableStatus = 'dashedBorder0000';
                }
                else{
                    newBoard[x][y].mutableStatus = 'dashedBorder1111';
                }
            }
        }
        return;
    }

    let topLeftArr: [number,number,kTile][] = killerTopLeftVals(kBoard);
    for (let val of topLeftArr) {
        newBoard[val[0]][val[1]].topleftnumber = val[2].sum;
    }

    // Holy Sacred Comment: Do NOT remove this comment under ANY circumstances, otherwise will break group outlines
    // \/                     \/
    // I removed the comment >:}
    // /\                     /\

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let neighbors: string[] = [];
            const opts: [number,number][] = [[x,y-1],[x+1,y],[x,y+1],[x-1,y]];
            for (let opt of opts) {
                const [x0,y0] = opt;
                if (!((0 <= x0 && x0 <= 8) && (0 <= y0 && y0 <= 8))) {
                    neighbors.push('0');
                } else if (kBoard[x0][y0].symbol == kBoard[x][y].symbol) {
                    neighbors.push('1');
                }
                else neighbors.push('0');
            }
            let str = `dashedBorder${neighbors.join('')}`;
            console.log(str);
            newBoard[x][y].mutableStatus = str;
        }
    }
}

function rand(a: number, b: number): number {
    return (Math.random() * (b-a+1) + a) >>0;
}

function killerTopLeftVals(input: kTile[][]): [number,number,kTile][] {
    let keyTrack: {[i: string]: boolean} = {};
    for (let char of kKey) {
        keyTrack[char] = false;
    }
    let output: [number,number,kTile][] = [];
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            const char = input[x][y].symbol;
            if (keyTrack[char] == false) {
                keyTrack[char] = true;
                output.push([x,y,input[x][y]]);
            }
        }
    }
    return output;
}

type kTile = {
    sum: number,
    size: number,
    symbol: string
};

function boardAdd(board: genBoardType, val: number, x: number, y: number): void {
    board.tile[x][y] = val;
    board.occ++;
    const a = (x/3 >>0)*3, b = (y/3 >>0)*3;
    for (let i = 0; i < 9; i++) {
        board.note[i][y][val] = false; //each in row
        board.note[x][i][val] = false; //each in col
        board.note[a+(i%3)][b+(i/3>>0)][val] = false; //each in 3x3
        board.note[x][y][i+1] = false; //each in this tile
    }
}

function HandleHighlighting(row: number, col: number, newBoard: SpaceButtonProperties[][], justPaused: boolean, difNum?: number) {
    if (!justPaused){
        try {
            // Clear the board of highlights
            for (let j = 0; j < 9; j++) {
                for (let k = 0; k < 9; k++) {
                    if (newBoard[j][k].highlighted !== 'spaceNumberTaken') {
                        newBoard[j][k].previousHighlight = newBoard[j][k].highlighted;
                        newBoard[j][k].highlighted = 'space'
                        console.log('j: ' + j + ', k: ' + k + ' highlighted with: ' + newBoard[j][k].highlighted);
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
                console.log ("BEFORE HIGHLIGHTING ROW COL " + newBoard[row][col].highlighted);
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

function doesntHaveRowColumnMatching(row: number, col: number, newBoard: SpaceButtonProperties[][]): boolean {
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

function SaveBoardState(newBoard: SpaceButtonProperties[][]) {
    console.log("saving this")
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            console.log("i: " + i + " j: " + j + " " + newBoard[i][j].highlighted + " with " + newBoard[i][j].data);
        }
    }

    console.log("save board state");
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            newBoard[i][j].previousHighlight = newBoard[i][j].highlighted;
            newBoard[i][j].savedData = newBoard[i][j].data;
        }
    }

    console.log("saved as")
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            console.log("i: " + i + " j: " + j + " " + newBoard[i][j].previousHighlight + " with " + newBoard[i][j].savedData);
        }
    }
}

function genKiller(tiles: number[][]): kTile[][] {
    //# of killer groups (vary on difficulty?)
    const AmountTotal: number = 32;

    const avail = (x: number, y: number): boolean => {
        if (!((0 <= x && x <= 8) && (0 <= y && y <= 8))) return false;
        return (groups[x][y].symbol != '.');
    }

    let groups: kTile[][] = [];
    for (let i = 0; i < 9; i++) {
        groups[i] = []
        for (let j = 0; j < 9; j++) {
            groups[i][j] = {sum: tiles[i][j], size: 1, symbol: '.'};
        }
    }

    //Puts (#) of tiles into initial groups, no picking already chosen tiles
    for (let i = 0; i < AmountTotal; i++) {
        let x = 0, y = 0;
        do {
            x = rand(0,8); y = rand(0,8);
        } while (groups[x][y].symbol != '.');
        groups[x][y].symbol = kKey[i];
    }

    //for each initial group, add bordering tiles until no blanks left
    for (let numBlank = 81-AmountTotal; numBlank > 0;) {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (groups[x][y].symbol != '.') {continue;}
                let neighbors: [number,number][] = [];
                const opts: [number,number][] = [[x-1,y],[x,y-1],[x+1,y],[x,y+1]];
                for (let opt of opts) {
                    const [x0,y0] = opt; 
                    if (avail(x0,y0)) neighbors.push([x0,y0]);
                }
                if (neighbors.length == 0) continue;
                //sort possible options by group size: smaller groups -> higher priority
                neighbors.sort((a,b)=>{return groups[a[0]][a[1]].size-groups[b[0]][b[1]].size});
                const [a,b] = neighbors[0];
                groups[a][b].size++;
                groups[a][b].sum += groups[x][y].sum;
                groups[x][y] = groups[a][b]; //merged, both locations now point to same tile/info
                numBlank--;
            }
        }
    }    
    return groups;
}

function toStr(input: number): string {
    return (input == 0) ? '' : input.toString();
}

function solve_gen(board: genBoardType, opt: number = 0): [number,number][] {
    let changes: [number,number][] = [];
    let tiles: number[][] = board.tile, notes: boolean[][][] = board.note;

    for (let progress: boolean = true; progress == true;) {
        progress = false;

        //solved a tile successfully, do stuff
        const success = (val: number, x: number, y: number): void => {
            progress = true; 
            changes.push([x,y]);
            boardAdd(board,val,x,y);
        }

        // Method 1: if theres only one note in a tile, put it in
        if (true) { //opt == 0 || opt >= 1 -> true
        for (let x = 0; x < 9; x++) { 
            for (let y = 0; y < 9; y++) {
                if (tiles[x][y] != 0) continue;
                let val: number = -1;
                for (let n: number = 1; n <= 9; n++) {
                    if (notes[x][y][n]) {
                        val = (val == -1) ? n : -2;
                    }
                }
                if (val >= 0) { //if there is one boolean true
                    success(val,x,y);
                }
                if (val == -1) { //tile is blank w/ no possible options -> BAD, return
                    board.state = false;
                    return changes;
                }
            }
        }}

        // Method 2: if theres only one note of a type in a row/col, put it in
        if (opt == 0 || opt >= 2) {
        for (let d1 = 0; d1 < 9; d1++) {
            for (let n: number = 1; n <= 9; n++) {
                let valR: number = -1;
                for (let d2 = 0; d2 < 9; d2++) {
                    if (tiles[d1][d2] == n) {
                        valR = -3; break;
                    }
                    if (tiles[d1][d2] == 0 && notes[d1][d2][n]) {
                        valR = (valR == -1) ? d2 : -2;
                    }
                }
                if (valR >= 0) { //if there is one boolean true
                    success(n,d1,valR);
                }
                let valC: number = -1;
                for (let d2 = 0; d2 < 9; d2++) {
                    if (tiles[d2][d1] == n) {
                        valC = -3; break;
                    }
                    if (tiles[d2][d1] == 0 && notes[d2][d1][n]) {
                        valC = (valC == -1) ? d2 : -2;
                    }
                }
                if (valC >= 0) { //if there is one boolean true
                    success(n,valC,d1);
                }
            }
        }}

        // Method 3: if one note exists only in two/three tiles in a 3x3, and
        // those are in same row/col, then remove all others in that row/col
        // NOTE: This doesnt work properly, but i dont really have
        // the time to fix it, need to focus on other things
        /*if (opt == 0 || opt >= 3) {
            //eliminate all notes in this row
            const clearRow = (row: number, val: number): void => {
                for (let y = 0; y < 9; y++) {
                    notes[row][y][val] = false;
                }
            }
            //eliminate all notes in this col
            const clearCol = (col: number, val: number): void => {
                for (let x = 0; x < 9; x++) {
                    notes[x][col][val] = false;
                }
            }

            for (let n: number = 1; n <= 9; n++) {
                for (let x = 0; x < 9; x++) {
                    let arr: [number,number][] = [];
                    for (let y = 0; y < 9; y++) {
                        const a = (y % 3)+(x % 3)*3, b = (y/3 >>0)+(x/3 >>0)*3;
                        if (tiles[a][b] == n) {arr = []; break;}
                        if (tiles[a][b] == 0 && notes[a][b][n]) arr.push([a,b]);
                    }
                    if (arr.length == 2) {
                        if (arr[0][0] == arr[1][0]) { //if same 'a' val
                            clearRow(arr[0][0],n);
                        }
                        if (arr[0][1] == arr[1][1]) { //if same 'b' val
                            clearCol(arr[0][1],n);
                        }
                    }
                    if (arr.length == 3) {
                        if (arr[0][0] == arr[1][0] && arr[1][0] == (arr[2])[0]) { //if same 'a' val
                            clearRow(arr[0][0],n); 
                        }
                        if (arr[0][1] == arr[1][1] && arr[1][1] == (arr[2])[1]) { //if same 'b' val
                            clearCol(arr[0][1],n);
                        }
                    }
                }
            }
        }*/

        // Method 4: if two types of notes form a pair, then remove all other
        //  notes from those tiles & those notes from that 3x3
        //if (opt == 0 || opt >= 4) {}

        // Method 5: idk how else to describe it: its the last one in this link
        //  https://www.conceptispuzzles.com/index.aspx?uri=puzzle/sudoku/techniques
        //if (opt == 0 || opt >= 5) {}

    }
    return changes;
}

function makeBoard(): genBoardType {
    const bl = () => {return [true,true,true,true,true,true,true,true,true,true]};
    return {
        tile: [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]],
        note: [
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()],
        [bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl(),bl()]],
        occ: 0, state: true
    };
}

function isValid(board: genBoardType): boolean {
    for (let d1 = 0; d1 < 9; d1++) {
        const a = (d1%3)*3, b = (d1/3>>0)*3;
        let nums1: boolean[] = [];
        let nums2: boolean[] = [];
        let nums3: boolean[] = [];
        for (let d2 = 0; d2 < 9; d2++) {
            const tile1 = board.tile[d1][d2];
            if (nums1[tile1] || tile1 == 0) return false;
            nums1[tile1] = true;
            const tile2 = board.tile[d2][d1];
            if (nums2[tile2] || tile2 == 0) return false;
            nums2[tile2] = true;
            const tile3 = board.tile[a+(d2%3)][b+(d2/3>>0)];
            if (nums3[tile3] || tile3 == 0) return false;
            nums3[tile3] = true;
        }
    }
    return true;
}
function randomOptions(tile: boolean[]): number[] {
    let arr: number[] = [];
    for (let i: number = 1; i <= 9; i++) {
        if (tile[i]) arr.push(i);
    }
    const sz = arr.length;
    for (let i = 0; i < sz; i++) {
        let j = rand(0,sz-1);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function boardRem(board: genBoardType, x: number, y: number): void {
    const reCalcNote = (val:number, x: number, y: number): boolean => {
        const a = (x/3 >>0)*3, b = (y/3 >>0)*3;
        for (let i = 0; i < 9; i++) {
            if (board.tile[i][y] == val) return false;
            if (board.tile[x][i] == val) return false;
            if (board.tile[a+(i%3)][b+(i/3>>0)] == val) return false;
        }
        return true;
    }
    const val = board.tile[x][y];
    board.tile[x][y] = 0;
    board.occ--;
    const a = (x/3 >>0)*3, b = (y/3 >>0)*3;
    for (let i = 0; i < 9; i++) {
        if (board.tile[i][y] == 0) board.note[i][y][val] = reCalcNote(val,i,y); //each in row
        if (board.tile[x][i] == 0) board.note[x][i][val] = reCalcNote(val,x,i); //each in col
        const c = a+(i%3), d = b+(i/3>>0);
        if (board.tile[c][d] == 0) board.note[c][d][val] = reCalcNote(val,c,d); //each in 3x3
        board.note[x][y][i+1] = reCalcNote(i+1,x,y); //each in this tile
    }
}

export default initBoard;
