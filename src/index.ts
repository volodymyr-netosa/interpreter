import * as fs from "fs";
import { Lexer } from "./Lexer/Lexer";
import { Parser } from "./Parser/Parser";
import { Interpeter } from "./Interpretator";

const source = fs.readFileSync("source.it");
const lexer = new Lexer(source.toString());
const parser = new Parser(lexer);
const interpreter = new Interpeter(parser);
const result = interpreter.interpret();
console.log(interpreter.GLOBAL_SCOPE);
