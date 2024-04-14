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

export function hideBoardTSFile(newBoard: SpaceButtonProperties[][]) {
    console.log("hide board");
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            newBoard[i][j].highlighted = 'space';
            newBoard[i][j].data = '';
        }
    }
}