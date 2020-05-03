import { EOF_SYMBOL } from "./LexerConfig";

export class Character {
    constructor(
        public char: string,
        public sourceIndex: number,
        public colIndex: number,
        public rowIndex: number
    ) {}

    toString() {
        let str;
        switch (this.char) {
            case " ":
                str = "whitespace";
                break;
            case "\t":
                str = "tab";
                break;
            case "\n":
                str = "newline";
                break;
            case EOF_SYMBOL:
                str = "eof";
                break;
            default:
                str = this.char;
        }
        return [this.rowIndex, this.colIndex, str].join(" ");
    }
}

export class Scanner {
    // handle position of reading pointer in source
    sourceIndex: number;
    rowIndex: number;
    colIndex: number;

    constructor(public sourceText: string) {
        this.movePointerToStart();
    }

    get() {
        const result = this.getCurrentCharacter();
        if (result.char === "\n") {
            this.movePointerToNextLine();
        } else if (result.char !== EOF_SYMBOL) {
            this.movePointerRight();
        }
        return result;
    }

    getCurrentCharacter(offset: number = 0) {
        let char = EOF_SYMBOL;
        if (!this.isEOF(offset)) {
            char = this.sourceText[this.sourceIndex + offset];
        }
        let result = new Character(char, this.sourceIndex, this.colIndex, this.rowIndex);
        return result;    
    }
    
    private movePointerToStart() {
        this.colIndex = 0;
        this.rowIndex = 0;
        this.sourceIndex = 0;
    }

    private movePointerRight() {
        this.sourceIndex++;
        this.colIndex++;
    }

    private movePointerToNextLine() {
        this.rowIndex++;
        this.sourceIndex++;
        this.colIndex = 0;
    }

    private isEOF(offset: number = 0) {
        return this.sourceIndex + offset >= this.sourceText.length;
    }
}