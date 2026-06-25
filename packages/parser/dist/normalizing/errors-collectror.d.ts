import type { SourceLocation } from "@loverry/ast";
export type NormalizationError = {
    readonly message: string;
    readonly file: string;
    readonly line: number;
    readonly column: number;
};
export declare class ErrorsCollector {
    private errors;
    constructor();
    add(message: string, source: SourceLocation): void;
    hasErrors(): boolean;
    getErrors(): NormalizationError[];
    execute(): void;
}
//# sourceMappingURL=errors-collectror.d.ts.map