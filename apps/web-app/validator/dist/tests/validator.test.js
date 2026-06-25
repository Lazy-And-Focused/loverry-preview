"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const vitest_1 = require("vitest");
(0, vitest_1.describe)("Validator", () => {
    (0, vitest_1.it)("should validate a simple AST", () => {
        const validator = new index_1.Validator();
        const ast = [
            { id: "node1", source: { file: "test.md", line: 1, column: 1 } },
            { id: "node2", source: { file: "test.md", line: 2, column: 1 } },
        ];
        const result = validator.execute(ast);
        (0, vitest_1.expect)(result.valid).toBe(false);
        (0, vitest_1.expect)(result.errors).toContain("Node at test.md:2 is missing an ID.");
    });
});
//# sourceMappingURL=validator.test.js.map