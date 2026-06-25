export declare const TokenType: {
    readonly Identifier: "Identifier";
    readonly Number: "Number";
    readonly Boolean: "Boolean";
    readonly String: "String";
    readonly Equals: "==";
    readonly NotEquals: "!=";
    readonly MoreThan: ">";
    readonly LessThan: "<";
    readonly MoreOrEquals: ">=";
    readonly LessOrEquals: "<=";
    readonly And: "and";
    readonly Or: "or";
    readonly Not: "not";
    readonly LeftParen: "(";
    readonly RightParen: ")";
    readonly Eof: "EOF";
};
export type TokenType = (typeof TokenType)[keyof typeof TokenType];
export type Token = {
    type: TokenType;
    value: string;
    position: number;
};
//# sourceMappingURL=token.d.ts.map