"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawValidator = void 0;
class RawValidator {
    errors = [];
    execute(scene) {
        this.errors = [];
        for (const node of scene.nodes) {
            this.validateNode(node);
        }
        return this.errors;
    }
    addError(message, source) {
        this.errors.push({
            message,
            file: source.file,
            line: source.line,
            column: source.column,
        });
    }
    validateNode(node) {
        switch (node.type) {
            case "dialogue":
                if (!node.rawSpeaker) {
                    this.addError("Dialogue node missing character", node.source);
                }
                if (!node.rawText) {
                    this.addError("Dialogue node missing text", node.source);
                }
                break;
            case "thought":
                if (!node.rawSpeaker) {
                    this.addError("Thought node missing character", node.source);
                }
                if (!node.rawText) {
                    this.addError("Thought node missing text", node.source);
                }
                break;
            case "action":
                if (!node.rawText) {
                    this.addError("Action node missing text", node.source);
                }
                break;
            case "system":
                if (!node.rawText) {
                    this.addError("System node missing text", node.source);
                }
                break;
            case "choice":
                for (const opt of node.options) {
                    if (!opt.rawText) {
                        this.addError("Choice option missing text", node.source);
                    }
                    for (const child of opt.nodes) {
                        this.validateNode(child);
                    }
                }
                break;
            case "transition":
                if (!node.rawTarget) {
                    this.addError("Transition node missing target", node.source);
                }
                break;
        }
    }
}
exports.RawValidator = RawValidator;
//# sourceMappingURL=raw-validator.js.map