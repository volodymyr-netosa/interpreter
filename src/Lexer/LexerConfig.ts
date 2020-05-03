import { Token } from "./Token";

const Alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
// const Digits = "1234567890".split("");

// export const Keywords = "if then else elif endif while loop endloop print return exit".split(" ");
// export const OneCharSymbols = "= ( ) < > / * + - ! & . ;".split(" ");
// export const TwoCharSymbols = "== <= >= <> != ++ ** -- += -= ||".split(" ");

// export const IDENTIFIER_STARCHARS = Alphabet;
// export const IDENTIFIER_CHARS = [...Alphabet, ...Digits, "_"];
export let WHITESPACE_CHARS = [9, 10, 13, 32].map((code) => String.fromCharCode(code));
export const EOF_SYMBOL = "\0";


export enum TokenTypes {
    DOT, SEMICOLON,
    PLUS, MINUS, DIVISION, MULTIPLICATION, LPAREN, RPAREN,
    STRING, INTEGER,
    IDENTIFIER,
    WHITESPACE, COMMENT, EOF,
    BEGIN, END,
    ASSIGNMENT, COMPARSION
}

export const SYMBOL_MAPPING: {[key: string]: TokenTypes} = {
    "+": TokenTypes.PLUS,
    "-": TokenTypes.MINUS,
    "/": TokenTypes.DIVISION,
    "*": TokenTypes.MULTIPLICATION,
    "(": TokenTypes.LPAREN,
    ")": TokenTypes.RPAREN,
    "\0": TokenTypes.EOF,
    ".": TokenTypes.DOT,
    ";": TokenTypes.SEMICOLON,
}

export const KEYWORDS_MAPPING: {[key: string]: TokenTypes} = {
    "BEGIN": TokenTypes.BEGIN,
    "END": TokenTypes.END,
}