import { Token } from "../Lexer/Token";

export class ASTNode {}

// this class means Node only stores value, not operator or smth else
export class ValueHolder extends ASTNode {
    token: Token;
    value: any;

    constructor(token: Token) {
        super();
        this.token = token;
        this.value = token.value;
    }
}

export class BinOperator extends ASTNode {
    left: any;
    right: any;
    operator: Token;
    token: Token;

    constructor(left: any, right: any, operator: Token) {
        super();
        this.left = left;
        this.right = right;
        this.operator = this.token = operator;
    }
}


export class UnaryOperator extends ASTNode {
    expr: any;
    token: Token;
    operator: Token;

    constructor(expr: any, operator: Token) {
        super();
        this.token = this.operator = operator;
        this.expr = expr;
    }
}

export class Assignment extends BinOperator {}

export class Variable extends ValueHolder {}

export class Num extends ValueHolder {}

// Begin-end block
export class Compound extends ASTNode {
    children: any[];

    constructor() {
        super();
        this.children = [];
    }

    addChild(child: any) {
        this.children.push(child);
    }
}

export class Empty extends ASTNode {};