"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionEvaluator = void 0;
const expressions_1 = require("@loverry/expressions");
class ExpressionEvaluator {
    dependencies;
    static BINARY_OPERATORS = {
        "==": (l, r) => l === r,
        "!=": (l, r) => l !== r,
        ">": (l, r) => l > r,
        "<": (l, r) => l < r,
        ">=": (l, r) => l >= r,
        "<=": (l, r) => l <= r,
        and: (l, r) => !!l && !!r,
        or: (l, r) => !!l || !!r,
    };
    static UNARY_OPERATOR = {
        not: (thisArgument, operand) => !thisArgument.execute(operand),
    };
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    execute(expression) {
        return this[expression.type](expression);
    }
    literal(expression) {
        const literalExpression = this.resolveExpression({
            expression,
            type: "literal",
        });
        return literalExpression.value;
    }
    variable_reference(expression) {
        const variableReferenceExpression = this.resolveExpression({
            expression,
            type: "variable_reference",
        });
        const value = this.dependencies.gameStateMap.get(variableReferenceExpression.variable);
        if (!value) {
            return false;
        }
        return value;
    }
    binary(expression) {
        const binaryExpression = this.resolveExpression({
            expression,
            type: "binary",
        });
        const left = this.execute(binaryExpression.left);
        const right = this.execute(binaryExpression.right);
        return ExpressionEvaluator.BINARY_OPERATORS[binaryExpression.operator](left, right);
    }
    unary(expression) {
        const unaryExpression = this.resolveExpression({
            expression,
            type: "unary",
        });
        return ExpressionEvaluator.UNARY_OPERATOR[unaryExpression.operator](this, unaryExpression.operand);
    }
    parseCondition(condition) {
        try {
            return expressions_1.Parser.execute(condition);
        }
        catch {
            return null;
        }
    }
    resolveExpression(options) {
        if (options.expression.type !== options.type) {
            throw new Error(`incompatibility of expressions type, expected ${options.type}, recieved ${options.expression.type}`);
        }
        return options.expression;
    }
}
exports.ExpressionEvaluator = ExpressionEvaluator;
//# sourceMappingURL=expression-evaluator.js.map