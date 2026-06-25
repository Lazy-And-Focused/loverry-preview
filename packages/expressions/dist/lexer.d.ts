import type { Token } from "./token";
export declare class Lexer {
    private readonly _input;
    private _current_char;
    private _position;
    constructor(input: string);
    execute(): Token[];
    private advance;
    private getCurrentChar;
    private skipWhitespace;
    private readIdentifier;
    private readNumber;
    private readString;
    nextToken(): Token;
}
//# sourceMappingURL=lexer.d.ts.map