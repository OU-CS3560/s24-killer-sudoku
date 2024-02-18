export class Space {
    constructor (row: number, col: number, data: number){
        this.data = data.toString();
        this.row = row;
        this.col = col;
        this.highlighted = 'space'
        this.UI = (<div className={this.highlighted}><button>{row}, {col}</button></div>);
    }

    private data: string;
        setNumber(newNum: number): void{this.data = newNum.toString();}
        getNumber(): string{return this.data;}

    private row: number;
        setRow(newNum: number): void{this.row = newNum;}
        getRow(): number{return this.row;}
    
    private col: number;
        setCol(newNum: number): void{this.col = newNum;}
        getCol(): number{return this.col;}

    private UI: any;
        setUI(UI: any): void{this.UI = UI;}
        getUI(): any{return this.UI;}

    private highlighted: string;
        setHighlighted(): void{this.highlighted = 'spaceHighlighted'}
        getIsHighlighted(): boolean{return (this.highlighted === 'spaceHighlighted');}
        toggleHighlighted(): any{this.highlighted === 'spaceHighlighted' ? 'space' : 'spaceHighlighted';}
}