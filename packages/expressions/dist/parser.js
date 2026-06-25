"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const token_1 = require("./token");
const lexer_1 = require("./lexer");
class Parser {
    static _precedence = new Map([
        [token_1.TokenType.Or, 10],
        [token_1.TokenType.And, 20],
        [token_1.TokenType.Equals, 30],
        [token_1.TokenType.NotEquals, 30],
        [token_1.TokenType.MoreThan, 40],
        [token_1.TokenType.LessThan, 40],
        [token_1.TokenType.MoreOrEquals, 40],
        [token_1.TokenType.LessOrEquals, 40],
        [token_1.TokenType.Not, 50],
    ]);
    static execute(input) {
        const lexer = new lexer_1.Lexer(input);
        const tokens = lexer.execute();
        const parser = new Parser(tokens);
        return parser.execute();
    }
    _tokens;
    _current = 0;
    constructor(tokens) {
        this._tokens = tokens;
    }
    execute() {
        const expression = this.parseExpression(0);
        const token = this.getToken();
        if (token.type !== token_1.TokenType.Eof) {
            throw new Error(`Unexpected token after expression: ${token.type}`);
        }
        return expression;
    }
    getToken() {
        const token = this._tokens[this._current];
        if (!token) {
            throw new Error("Token is not defined");
        }
        return token;
    }
    consume(type) {
        const token = this.getToken();
        if (type && token.type !== type) {
            throw new Error(`Expected ${type}, got ${token.type} at position ${token.position}`);
        }
        this._current++;
        return token;
    }
    getPrecedence(type) {
        return Parser._precedence.get(type) ?? 0;
    }
    parseLiteral() {
        const token = this.consume();
        let value = token.value;
        if (token.type === token_1.TokenType.Number) {
            value = parseFloat(token.value);
        }
        else if (token.type === token_1.TokenType.Boolean) {
            value = token.value === "true";
        }
        else if (token.type === token_1.TokenType.String) {
            // строка
        }
        else {
            throw new Error(`Unexpected token for literal: ${token.type}`);
        }
        const expression = {
            type: "literal",
            value,
        };
        return expression;
    }
    parseVariable() {
        const token = this.consume(token_1.TokenType.Identifier);
        const expression = {
            type: "variable_reference",
            variable: token.value,
        };
        return expression;
    }
    parseGrouped() {
        this.consume(token_1.TokenType.LeftParen);
        const expression = this.parseExpression(0);
        this.consume(token_1.TokenType.RightParen);
        return expression;
    }
    parsePrefixNot() {
        const precedence = this.getPrecedence(token_1.TokenType.Not);
        const operand = this.parseExpression(precedence);
        const expression = {
            type: "unary",
            operator: "not",
            operand,
        };
        return expression;
    }
    parseBinary(left, precedence, opType) {
        const right = this.parseExpression(precedence);
        let operator;
        switch (opType) {
            case token_1.TokenType.Equals:
                operator = "==";
                break;
            case token_1.TokenType.NotEquals:
                operator = "!=";
                break;
            case token_1.TokenType.MoreThan:
                operator = ">";
                break;
            case token_1.TokenType.LessThan:
                operator = "<";
                break;
            case token_1.TokenType.MoreOrEquals:
                operator = ">=";
                break;
            case token_1.TokenType.LessOrEquals:
                operator = "<=";
                break;
            case token_1.TokenType.And:
                operator = "and";
                break;
            case token_1.TokenType.Or:
                operator = "or";
                break;
            default:
                throw new Error(`Unknown binary operator ${opType}`);
        }
        const expression = {
            type: "binary",
            operator,
            left,
            right,
        };
        return expression;
    }
    parseExpression(minPrecedence) {
        let left;
        const token = this.getToken();
        switch (token.type) {
            case token_1.TokenType.Number:
            case token_1.TokenType.Boolean:
            case token_1.TokenType.String:
                left = this.parseLiteral();
                break;
            case token_1.TokenType.Identifier:
                left = this.parseVariable();
                break;
            case token_1.TokenType.LeftParen:
                left = this.parseGrouped();
                break;
            case token_1.TokenType.Not:
                left = this.parsePrefixNot();
                break;
            default:
                throw new Error(`Unexpected token at start of expression: ${token.type}`);
        }
        while (true) {
            const nextToken = this.getToken();
            if (nextToken.type === token_1.TokenType.Eof) {
                break;
            }
            const precedence = this.getPrecedence(nextToken.type);
            if (precedence < minPrecedence) {
                break;
            }
            switch (nextToken.type) {
                case token_1.TokenType.Equals:
                case token_1.TokenType.NotEquals:
                case token_1.TokenType.MoreThan:
                case token_1.TokenType.LessThan:
                case token_1.TokenType.MoreOrEquals:
                case token_1.TokenType.LessOrEquals:
                case token_1.TokenType.And:
                case token_1.TokenType.Or:
                    left = this.parseBinary(left, precedence, nextToken.type);
                    break;
                default:
                    return left;
            }
        }
        return left;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map