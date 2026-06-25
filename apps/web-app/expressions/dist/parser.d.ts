import type { Token } from "./token";
import type { Expression } from "@loverry/ast";
export declare class Parser {
    private static readonly _precedence;
    static execute(input: string): Expression;
    private _tokens;
    private _current;
    constructor(tokens: Token[]);
    execute(): Expression;
    private getToken;
    private consume;
    private getPrecedence;
    private parseLiteral;
    private parseVariable;
    private parseGrouped;
    private parsePrefixNot;
    private parseBinary;
    private parseExpression;
}
//# sourceMappingURL=parser.d.ts.map