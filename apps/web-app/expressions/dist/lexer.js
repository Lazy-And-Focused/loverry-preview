"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const token_1 = require("./token");
class Lexer {
    _input;
    _current_char = null;
    _position = 0;
    constructor(input) {
        this._input = input;
        this._current_char = (input.length > 0 ? input[0] : null) || null;
    }
    execute() {
        const tokens = [];
        let token = this.nextToken();
        while (token.type !== token_1.TokenType.Eof) {
            tokens.push(token);
            token = this.nextToken();
        }
        tokens.push(token);
        return tokens;
    }
    advance() {
        this._position++;
        const char = (() => {
            if (this._position < this._input.length) {
                return this._input[this._position] || null;
            }
            return null;
        })();
        this._current_char = char;
        return char;
    }
    getCurrentChar() {
        const peekPosition = this._position + 1;
        const peek = (() => {
            if (peekPosition < this._input.length) {
                return this._input[peekPosition] || null;
            }
            return null;
        })();
        return peek;
    }
    skipWhitespace() {
        while (this._current_char && /\s/.test(this._current_char)) {
            this.advance();
        }
    }
    readIdentifier() {
        let result = "";
        while (this._current_char &&
            /[a-zA-Z_][a-zA-Z0-9_]*/.test(this._current_char)) {
            result += this._current_char;
            this.advance();
        }
        return result;
    }
    readNumber() {
        let result = "";
        while (this._current_char && /[0-9.]/.test(this._current_char)) {
            result += this._current_char;
            this.advance();
        }
        return result;
    }
    readString() {
        const quote = this._current_char;
        this.advance();
        let result = "";
        while (this._current_char && this._current_char !== quote) {
            if (this._current_char === "\\") {
                const escaped = this.advance();
                if (escaped === quote) {
                    result += quote;
                }
                else if (escaped === "n") {
                    result += "\n";
                }
                else if (escaped === "t") {
                    result += "\t";
                }
                else if (escaped) {
                    result += escaped;
                }
            }
            else {
                result += this._current_char;
            }
            this.advance();
        }
        this.advance();
        return result;
    }
    nextToken() {
        this.skipWhitespace();
        if (this._current_char === null) {
            return { type: token_1.TokenType.Eof, value: "", position: this._position };
        }
        const startPos = this._position;
        switch (this._current_char) {
            case "(":
                this.advance();
                return { type: token_1.TokenType.LeftParen, value: "(", position: startPos };
            case ")":
                this.advance();
                return { type: token_1.TokenType.RightParen, value: ")", position: startPos };
            case "=":
                if (this.getCurrentChar() === "=") {
                    this.advance();
                    this.advance();
                    return { type: token_1.TokenType.Equals, value: "==", position: startPos };
                }
                throw new Error(`Unexpected character '=' at position ${startPos}`);
            case "!":
                if (this.getCurrentChar() === "=") {
                    this.advance();
                    this.advance();
                    return { type: token_1.TokenType.NotEquals, value: "!=", position: startPos };
                }
                throw new Error(`Unexpected character '!' at position ${startPos}`);
            case ">":
                if (this.getCurrentChar() === "=") {
                    this.advance();
                    this.advance();
                    return {
                        type: token_1.TokenType.MoreOrEquals,
                        value: ">=",
                        position: startPos,
                    };
                }
                this.advance();
                return { type: token_1.TokenType.MoreThan, value: ">", position: startPos };
            case "<":
                if (this.getCurrentChar() === "=") {
                    this.advance();
                    this.advance();
                    return {
                        type: token_1.TokenType.LessOrEquals,
                        value: "<=",
                        position: startPos,
                    };
                }
                this.advance();
                return { type: token_1.TokenType.LessThan, value: "<", position: startPos };
        }
        if (/[0-9]/.test(this._current_char)) {
            const value = this.readNumber();
            return { type: token_1.TokenType.Number, value, position: startPos };
        }
        if (this._current_char === '"' || this._current_char === "'") {
            const value = this.readString();
            return { type: token_1.TokenType.String, value, position: startPos };
        }
        if (/[a-zA-Z_]/.test(this._current_char)) {
            const ident = this.readIdentifier();
            if (ident === "true" || ident === "false") {
                return { type: token_1.TokenType.Boolean, value: ident, position: startPos };
            }
            switch (ident) {
                case "and":
                    return { type: token_1.TokenType.And, value: ident, position: startPos };
                case "or":
                    return { type: token_1.TokenType.Or, value: ident, position: startPos };
                case "not":
                    return { type: token_1.TokenType.Not, value: ident, position: startPos };
                default:
                    return {
                        type: token_1.TokenType.Identifier,
                        value: ident,
                        position: startPos,
                    };
            }
        }
        throw new Error(`Unexpected character '${this._current_char}' at position ${startPos}`);
    }
}
exports.Lexer = Lexer;
//# sourceMappingURL=lexer.js.map