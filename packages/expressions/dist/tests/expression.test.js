"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("../index");
(0, vitest_1.describe)("Expression parser", () => {
    (0, vitest_1.it)("parses a simple variable", () => {
        const expression = (0, index_1.parseExpression)("lanlir_control");
        (0, vitest_1.expect)(expression).toEqual({
            type: "variable_reference",
            variable: "lanlir_control",
        });
    });
    (0, vitest_1.it)("parses equality", () => {
        const expression = (0, index_1.parseExpression)("a == 5");
        (0, vitest_1.expect)(expression.type).toBe("binary");
        if (expression.type !== "binary")
            return;
        (0, vitest_1.expect)(expression.operator).toBe("==");
        (0, vitest_1.expect)(expression.left).toMatchObject({
            type: "variable_reference",
            variable: "a",
        });
        (0, vitest_1.expect)(expression.right).toMatchObject({ type: "literal", value: 5 });
    });
    (0, vitest_1.it)('parses "and" with precedence', () => {
        const expression = (0, index_1.parseExpression)("a and b or c");
        (0, vitest_1.expect)(expression.type).toBe("binary");
        if (expression.type !== "binary")
            return;
        // (a and b) or c
        (0, vitest_1.expect)(expression.operator).toBe("or");
        (0, vitest_1.expect)(expression.left.type).toBe("binary");
        if (expression.left.type !== "binary")
            return;
        (0, vitest_1.expect)(expression.left.operator).toBe("and");
        (0, vitest_1.expect)(expression.right).toMatchObject({
            type: "variable_reference",
            variable: "c",
        });
    });
    (0, vitest_1.it)('parses "not" unary', () => {
        const expression = (0, index_1.parseExpression)("not met_kerio");
        (0, vitest_1.expect)(expression.type).toBe("unary");
        if (expression.type !== "unary")
            return;
        (0, vitest_1.expect)(expression.operator).toBe("not");
        (0, vitest_1.expect)(expression.operand).toMatchObject({
            type: "variable_reference",
            variable: "met_kerio",
        });
    });
    (0, vitest_1.it)("parses parentheses", () => {
        const expression = (0, index_1.parseExpression)("a and (b or c)");
        (0, vitest_1.expect)(expression.type).toBe("binary");
        if (expression.type !== "binary")
            return;
        (0, vitest_1.expect)(expression.operator).toBe("and");
        (0, vitest_1.expect)(expression.right.type).toBe("binary");
        if (expression.right.type !== "binary")
            return;
        (0, vitest_1.expect)(expression.right.operator).toBe("or");
    });
    (0, vitest_1.it)("handles numbers and booleans", () => {
        const expression = (0, index_1.parseExpression)("x >= 10 and flag == true");
        (0, vitest_1.expect)(expression).toBeDefined();
        (0, vitest_1.expect)(expression.type).toBe("binary");
        if (expression.type !== "binary")
            return;
        const left = expression.left;
        (0, vitest_1.expect)(left.type).toBe("binary");
        if (left.type !== "binary")
            return;
        (0, vitest_1.expect)(left.operator).toBe(">=");
        (0, vitest_1.expect)(left.right.type).toBe("literal");
        if (left.right.type !== "literal")
            return;
        (0, vitest_1.expect)(left.right.value).toBe(10);
        const right = expression.right;
        (0, vitest_1.expect)(right.type).toBe("binary");
        if (right.type !== "binary")
            return;
        (0, vitest_1.expect)(right.operator).toBe("==");
        (0, vitest_1.expect)(right.right.type).toBe("literal");
        if (right.right.type !== "literal")
            return;
        (0, vitest_1.expect)(right.right.value).toBe(true);
    });
    (0, vitest_1.it)("throws on invalid syntax", () => {
        (0, vitest_1.expect)(() => (0, index_1.parseExpression)("a and")).toThrow();
        (0, vitest_1.expect)(() => (0, index_1.parseExpression)("(a + b)")).toThrow();
    });
});
(0, vitest_1.describe)("Lexer", () => {
    (0, vitest_1.it)("tokenizes correctly", () => {
        const lexer = new index_1.Lexer("a == 5 and not b");
        const tokens = lexer.execute();
        (0, vitest_1.expect)(tokens.map((t) => t.type)).toEqual([
            "Identifier",
            "==",
            "Number",
            "and",
            "not",
            "Identifier",
            "EOF",
        ]);
    });
});
//# sourceMappingURL=expression.test.js.map