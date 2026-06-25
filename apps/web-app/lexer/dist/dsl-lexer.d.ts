import type { Token } from "@loverry/enums";
export declare class DslLexer {
    private readonly _lines;
    private _current_line;
    constructor(input: string);
    execute(): Token[];
    nextToken(): Token;
    private getLine;
    private advance;
    private isEof;
    private createToken;
}
//# sourceMappingURL=dsl-lexer.d.ts.map