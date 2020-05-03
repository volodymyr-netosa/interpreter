import { Scanner, Character } from "./Scanner";
import { WHITESPACE_CHARS, EOF_SYMBOL, TokenTypes, SYMBOL_MAPPING, KEYWORDS_MAPPING } from "./LexerConfig";
import { Token } from "./Token";

export class Lexer {
    scanner: Scanner;

    constructor(sourceText: string) {
        this.scanner = new Scanner(sourceText);
    }

    get(): Token {
        let char = this.getChar();
        if (this.isNumber(char.char)) {
            let token = this.getInteger(char);
            return new Token(TokenTypes.INTEGER, token)
        }
        // even our variables starts with letter, so it's pretty good
        if (this.isLetter(char.char)) {
            return this.getWordToken(char);
        }
        const assignment = this.tryReadAssignment(char);
        if (assignment) {
            return assignment;
        }

        const type = SYMBOL_MAPPING[char.char];
        if (typeof type === "undefined") {
            this.raiseError();
        }
        return new Token(type, char.char);
    }

    tryReadAssignment(currentChar: Character) {
        // this need to be rewrited if there will be something started with ":"
        if (currentChar.char !== ":") {
            return false;
        }
        const symbol = this.scanner.get();
        if (symbol.char === "=") {
            return new Token(TokenTypes.ASSIGNMENT, ":=");
        } else {
            this.raiseError();
        }
        
    }

    getWordToken(startChar: Character) {
        let result = startChar.char
        let symbol = this.scanner.getCurrentCharacter();
        while(this.isCorrectVariableLetter(symbol.char)) {
            result += symbol.char;
            this.scanner.get();
            symbol = this.scanner.getCurrentCharacter();
        }

        const type = KEYWORDS_MAPPING[result] || TokenTypes.IDENTIFIER;
        if (type != TokenTypes.IDENTIFIER) {
            result = result.toUpperCase();
        }
        return new Token(type, result);
    }

    raiseError() {
        throw new Error("Lexer error parsing");
    }

    private getChar() {
        let character = this.scanner.get();
        
        // skipping all whitespaces
        while (WHITESPACE_CHARS.includes(character.char)) {
            character = this.scanner.get();
        }

        return character;
    }
    
    private getInteger(startChar: Character) {
        let result = startChar.char;
        let current = this.scanner.getCurrentCharacter();
        while (current.char !== EOF_SYMBOL && this.isNumber(current.char)) {
            result += current.char;
            this.scanner.get();
            current = this.scanner.getCurrentCharacter();
        }
        return +result;
    }

    isLetter(str: string) {
        return str.length === 1 && str.match(/[a-z]/i);
    }

    isNumber(str: string) {
        return str.length === 1 && str.match(/[0-9]/);
    }

    isCorrectVariableLetter(str: string) {
        return str.match(/[a-zA-Z_0-9]/);
    }
}