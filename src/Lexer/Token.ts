import { TokenTypes } from "./LexerConfig";

export class Token {
    value: any;
    type: TokenTypes = null;

    constructor(type: TokenTypes, value: any) {
        this.value = value;
        this.type = type;
    }
}