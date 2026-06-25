import { describe, it, expect } from "vitest";
import { parseExpression, Lexer } from "../index";

describe("Expression parser", () => {
  it("parses a simple variable", () => {
    const expression = parseExpression("lanlir_control");
    expect(expression).toEqual({
      type: "variable_reference",
      variable: "lanlir_control",
    });
  });

  it("parses equality", () => {
    const expression = parseExpression("a == 5");
    expect(expression.type).toBe("binary");
    if (expression.type !== "binary") return;

    expect(expression.operator).toBe("==");
    expect(expression.left).toMatchObject({
      type: "variable_reference",
      variable: "a",
    });
    expect(expression.right).toMatchObject({ type: "literal", value: 5 });
  });

  it('parses "and" with precedence', () => {
    const expression = parseExpression("a and b or c");
    expect(expression.type).toBe("binary");
    if (expression.type !== "binary") return;

    // (a and b) or c
    expect(expression.operator).toBe("or");
    expect(expression.left.type).toBe("binary");
    if (expression.left.type !== "binary") return;
    expect(expression.left.operator).toBe("and");
    expect(expression.right).toMatchObject({
      type: "variable_reference",
      variable: "c",
    });
  });

  it('parses "not" unary', () => {
    const expression = parseExpression("not met_kerio");
    expect(expression.type).toBe("unary");
    if (expression.type !== "unary") return;

    expect(expression.operator).toBe("not");
    expect(expression.operand).toMatchObject({
      type: "variable_reference",
      variable: "met_kerio",
    });
  });

  it("parses parentheses", () => {
    const expression = parseExpression("a and (b or c)");
    expect(expression.type).toBe("binary");
    if (expression.type !== "binary") return;

    expect(expression.operator).toBe("and");
    expect(expression.right.type).toBe("binary");
    if (expression.right.type !== "binary") return;

    expect(expression.right.operator).toBe("or");
  });

  it("handles numbers and booleans", () => {
    const expression = parseExpression("x >= 10 and flag == true");
    expect(expression).toBeDefined();
    expect(expression.type).toBe("binary");
    if (expression.type !== "binary") return;

    const left = expression.left;
    expect(left.type).toBe("binary");
    if (left.type !== "binary") return;

    expect(left.operator).toBe(">=");
    expect(left.right.type).toBe("literal");
    if (left.right.type !== "literal") return;
    expect(left.right.value).toBe(10);

    const right = expression.right;
    expect(right.type).toBe("binary");
    if (right.type !== "binary") return;

    expect(right.operator).toBe("==");
    expect(right.right.type).toBe("literal");
    if (right.right.type !== "literal") return;
    expect(right.right.value).toBe(true);
  });

  it("throws on invalid syntax", () => {
    expect(() => parseExpression("a and")).toThrow();
    expect(() => parseExpression("(a + b)")).toThrow();
  });
});

describe("Lexer", () => {
  it("tokenizes correctly", () => {
    const lexer = new Lexer("a == 5 and not b");
    const tokens = lexer.execute();
    expect(tokens.map((t) => t.type)).toEqual([
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
