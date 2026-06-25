import type { BaseNode } from "@loverry/ast";

export * from "./raw-validator";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export class Validator {
  public execute(ast: BaseNode[]): ValidationResult {
    const errors: string[] = [];

    for (const node of ast) {
      if (!node.id) {
        errors.push(
          `Node at ${node.source.file}:${node.source.line} is missing an ID.`,
        );
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
