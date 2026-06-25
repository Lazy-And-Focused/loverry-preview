import type { RawScene } from "@loverry/ast";
export type ValidationError = {
    message: string;
    file: string;
    line: number;
    column: number;
};
export declare class RawValidator {
    private errors;
    execute(scene: RawScene): ValidationError[];
    private addError;
    private validateNode;
}
//# sourceMappingURL=raw-validator.d.ts.map