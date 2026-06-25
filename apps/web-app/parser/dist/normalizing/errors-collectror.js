"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsCollector = void 0;
class ErrorsCollector {
    errors = [];
    constructor() { }
    add(message, source) {
        this.errors.push({
            message,
            file: source.file,
            line: source.line,
            column: source.column,
        });
    }
    hasErrors() {
        return this.errors.length > 0;
    }
    getErrors() {
        return this.errors;
    }
    execute() {
        if (this.errors.length) {
            return;
        }
        const errorMessages = this.errors
            .map((e) => `[${e.file}:${e.line}:${e.column}] ${e.message}`)
            .join("\n");
        throw new Error(`Normalization failed:\n${errorMessages}`);
    }
}
exports.ErrorsCollector = ErrorsCollector;
//# sourceMappingURL=errors-collectror.js.map