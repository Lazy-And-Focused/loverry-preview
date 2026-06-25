"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DslLexer = void 0;
const enums_1 = require("@loverry/enums");
class DslLexer {
    _lines;
    _current_line = 0;
    constructor(input) {
        this._lines = input.split(/\r?\n/);
    }
    execute() {
        const tokens = [];
        let token = this.nextToken();
        while (token.type !== enums_1.TokenType.eof) {
            tokens.push(token);
            token = this.nextToken();
        }
        tokens.push(token);
        return tokens;
    }
    nextToken() {
        if (this.isEof()) {
            return this.createToken(enums_1.TokenType.eof, "", "", 0);
        }
        const line = this.getLine().trim();
        const lowerLine = line.toLowerCase();
        const column = lowerLine.length - lowerLine.length;
        const tokenType = (0, enums_1.detectTokenType)(lowerLine);
        this.advance();
        return this.createToken(tokenType ?? enums_1.TokenType.ignored_line, lowerLine, line, column);
    }
    getLine() {
        return this._lines[this._current_line];
    }
    advance() {
        this._current_line++;
    }
    isEof() {
        return this._current_line >= this._lines.length;
    }
    createToken(type, value, rawValue, column) {
        return {
            type,
            lowerValue: value,
            value: rawValue,
            line: this._current_line,
            column
        };
    }
}
exports.DslLexer = DslLexer;
//# sourceMappingURL=dsl-lexer.js.map