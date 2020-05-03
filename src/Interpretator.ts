import { ASTNode, BinOperator, Num, UnaryOperator, Compound, Assignment, Variable, Empty } from "./AST/AST";
import { Parser } from "./Parser/Parser";
import { TokenTypes } from "./Lexer/LexerConfig";

/* Implementing visitor pattern */

class NodeVisitor {
    visit(node: ASTNode) {
        const methodName = "visit" + node.constructor.name;
        const method = Object.getPrototypeOf(this)[methodName] || this.genericVisit;
        return method.call(this, node);
    }

    genericVisit(node: ASTNode) {
        throw Error(`No visit method for type ${typeof node}`);
    }
}


export class Interpeter extends NodeVisitor {
    parser: Parser;
    GLOBAL_SCOPE: {[key: string]: any} = {};

    constructor(parser: Parser) {
        super();
        this.parser = parser;
    }

    visitBinOperator(node: BinOperator) {
        switch (node.operator.type) {
            case TokenTypes.PLUS: 
                return this.visit(node.left) + this.visit(node.right);
            case TokenTypes.MINUS:
                return this.visit(node.left) - this.visit(node.right);
            case TokenTypes.MULTIPLICATION:
                return this.visit(node.left) * this.visit(node.right);
            case TokenTypes.DIVISION:
                return this.visit(node.left) / this.visit(node.right);
        }
    }

    visitNum(node: Num) {
        return node.value;
    }

    visitUnaryOperator(node: UnaryOperator) {
        switch(node.operator.type) {
            case TokenTypes.PLUS: 
                return +this.visit(node.expr);
            case TokenTypes.MINUS:
                return -this.visit(node.expr);
        }
    }
    
    visitAssignment(node: Assignment) {
        const varName = node.left.value;
        this.GLOBAL_SCOPE[varName] = this.visit(node.right);
    }

    visitVariable(node: Variable) {
        const varName = node.value;
        if (this.GLOBAL_SCOPE.hasOwnProperty(varName)) {
            return this.GLOBAL_SCOPE[varName];
        } else {
            this.raiseNameError(varName);
        }
    }

    visitEmpty(node: Empty) {}

    visitCompound(node: Compound) {
        node.children.forEach((child) => this.visit(child));
    }

    raiseNameError(name: string) {
        throw Error(`NameError, no variable ${name} found`);
    }

    interpret() {
        const tree = this.parser.parse();
        return this.visit(tree);
    }
}