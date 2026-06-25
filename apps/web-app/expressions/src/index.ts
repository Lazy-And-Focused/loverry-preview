import type { Expression } from "@loverry/ast";
import { Parser } from "./parser";

/** @deprecated */
export function parseExpression(input: string): Expression {
  return Parser.execute(input);
}

export * from "./lexer";
export * from "./parser";
export * from "./token";
