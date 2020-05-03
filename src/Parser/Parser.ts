import { Lexer } from "../Lexer/Lexer";
import { Token } from "../Lexer/Token";
import { TokenTypes } from "../Lexer/LexerConfig";
import { BinOperator, Num, ASTNode, UnaryOperator, Empty, Assignment, Variable, Compound } from "../AST/AST";

export class Parser {
    lexer: Lexer;
    currentToken: Token;

    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.get();
    }

    raiseError() {
        throw new Error("Invalid syntax");
    }

    eat(type: TokenTypes) {
        if (this.currentToken.type === type) {
            this.currentToken = this.lexer.get();
        } else {
            this.raiseError();
        }
    }

    parse() {
        const node = this.program();
        if (this.currentToken.type !== TokenTypes.EOF) {
            this.raiseError();
        }
        return node;
    }

    term() {
        let node = this.factor();

        while ([TokenTypes.MULTIPLICATION, TokenTypes.DIVISION].includes(this.currentToken.type)) {
            const token = this.currentToken;
            this.eat(this.currentToken.type);
            node = new BinOperator(node, this.factor(), token)
        }
        return node;
    }

    factor(): ASTNode {
        const token = this.currentToken;
        switch (token.type) {
            case TokenTypes.INTEGER:
                this.eat(TokenTypes.INTEGER);
                return new Num(token);
            case TokenTypes.LPAREN:
                this.eat(TokenTypes.LPAREN);
                let node = this.expression();
                this.eat(TokenTypes.RPAREN);
                return node;
            case TokenTypes.PLUS:
                this.eat(TokenTypes.PLUS);
                return new UnaryOperator(this.factor(), token);
            case TokenTypes.MINUS:
                this.eat(TokenTypes.MINUS);
                return new UnaryOperator(this.factor(), token);
            default:
                return this.variable();
        }
    }

    program() {
        // program : compound_statement DOT
        const node = this.compoundStatement();
        this.eat(TokenTypes.DOT);
        return node;
    }

    compoundStatement() {
        // compound_statement: BEGIN statement_list END
        this.eat(TokenTypes.BEGIN);
        const node = this.statementList();
        this.eat(TokenTypes.END);

        const root = new Compound();
        node.forEach((child) => root.addChild(child));
        return root;
    }

    statementList() {
        /*
        statement_list : statement
                       | statement SEMI statement_list
        */
        const node = this.statement();
        let results: ASTNode[] = [node];

        while (this.currentToken.type === TokenTypes.SEMICOLON) {
            this.eat(TokenTypes.SEMICOLON);
            results.push(this.statement());
        }
        // i dont get it
        if (this.currentToken.type === TokenTypes.IDENTIFIER) {
            this.raiseError();
        }
        return results;
    }

    statement() {
        /*
        statement : compound_statement
                  | assignment_statement
                  | empty
        */
        let node;
        if (this.currentToken.type === TokenTypes.BEGIN) {
            node = this.compoundStatement();
        } else if (this.currentToken.type === TokenTypes.IDENTIFIER) {
            node = this.assignmentStatement();
        } else {
            node = this.empty();
        }
        return node;
    }

    empty() {
        return new Empty();
    }

    assignmentStatement() {
        // assignment_statement : variable ASSIGN expr
        const left = this.variable();
        const token = this.currentToken;
        this.eat(TokenTypes.ASSIGNMENT);
        const right = this.expression();
        return new Assignment(left, right, token);
    }

    variable() {
        const node = new Variable(this.currentToken);
        this.eat(TokenTypes.IDENTIFIER);
        return node;
    }

    expression() {
        // expr : term ((PLUS | MINUS) term)*
        let node = this.term();
        while ([TokenTypes.PLUS, TokenTypes.MINUS].includes(this.currentToken.type)) {
            const token = this.currentToken;
            this.eat(this.currentToken.type);
            node = new BinOperator(node, this.term(), token);
        }
        return node;
    }
}