import type { BaseNode } from "@loverry/ast";
import { Validator } from "../index";
import { describe, it, expect } from "vitest";

describe("Validator", () => {
  it("should validate a simple AST", () => {
    const validator = new Validator();
    const ast: BaseNode[] = [
      { id: "node1", source: { file: "test.md", line: 1, column: 1 } },
      { id: "node2", source: { file: "test.md", line: 2, column: 1 } },
    ];
    const result = validator.execute(ast);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Node at test.md:2 is missing an ID.");
  });
});
