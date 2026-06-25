import type { BaseNode } from "@loverry/ast";
export * from "./raw-validator";
export type ValidationResult = {
    valid: boolean;
    errors: string[];
};
export declare class Validator {
    execute(ast: BaseNode[]): ValidationResult;
}
//# sourceMappingURL=index.d.ts.map