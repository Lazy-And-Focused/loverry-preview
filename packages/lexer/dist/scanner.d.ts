import type { SourceLocation } from "@loverry/ast";
export declare class Scanner {
    private readonly _input;
    private _position;
    private _line;
    private _column;
    constructor(input: string);
    getChar(): string;
    advance(): string;
    isEof(): boolean;
    getLocation(): SourceLocation;
}
//# sourceMappingURL=scanner.d.ts.map