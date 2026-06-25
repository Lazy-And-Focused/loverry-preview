"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionParser = void 0;
const expressions_1 = require("@loverry/expressions");
class ExpressionParser {
    dependencies;
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    parseCondition({ source, condition, }) {
        if (!condition) {
            return undefined;
        }
        try {
            const expression = expressions_1.Parser.execute(condition);
            return expression;
        }
        catch (err) {
            this.dependencies.errors.add(`Failed to parse condition "${condition}": ${err}`, source);
            return undefined;
        }
    }
    parseEffect(raw, source) {
        const match = raw.match(/^(\w+)\s*([+\-]?=)\s*(.+)$/);
        if (!match) {
            this.dependencies.errors.add(`Invalid effect syntax: "${raw}"`, source);
            return null;
        }
        const variable = match[1];
        let operator = match[2];
        const valueString = match[3].trim();
        if (!this.dependencies.registries.variables[variable]) {
            this.dependencies.errors.add(`Unknown variable "${variable}"`, source);
            return null;
        }
        let value;
        if (/^-?\d+(\.\d+)?$/.test(valueString)) {
            value = parseFloat(valueString);
        }
        else if (valueString === "true") {
            value = true;
        }
        else if (valueString === "false") {
            value = false;
        }
        else {
            value = valueString;
        }
        return { variable: variable, operator, value, source };
    }
    parseEventArgument(argument) {
        if (/^-?\d+(\.\d+)?$/.test(argument)) {
            return parseFloat(argument);
        }
        if (argument === "true") {
            return true;
        }
        if (argument === "false") {
            return false;
        }
        return argument;
    }
    parseEvent({ source, event, }) {
        if (!event) {
            return undefined;
        }
        const parts = event.trim().split(/\s+/);
        const id = parts[0];
        if (!this.dependencies.registries.events[id]) {
            this.dependencies.errors.add(`Unknown event "${id}"`, source);
            return undefined;
        }
        const args = parts.slice(1).map((a) => this.parseEventArgument(a));
        return {
            id: id,
            arguments: args,
        };
    }
}
exports.ExpressionParser = ExpressionParser;
//# sourceMappingURL=expression-parser.js.map