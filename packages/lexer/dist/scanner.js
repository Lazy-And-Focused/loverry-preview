"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
class Scanner {
    _input;
    _position = 0;
    _line = 1;
    _column = 1;
    constructor(input) {
        this._input = input;
    }
    getChar() {
        return this._input[this._position] ?? "";
    }
    advance() {
        const char = this.getChar();
        if (char === "\n") {
            this._line++;
            this._column = 1;
        }
        else {
            this._column++;
        }
        this._position++;
        return char;
    }
    isEof() {
        return this._position >= this._input.length;
    }
    getLocation() {
        return { file: "", line: this._line, column: this._column };
    }
}
exports.Scanner = Scanner;
//# sourceMappingURL=scanner.js.map