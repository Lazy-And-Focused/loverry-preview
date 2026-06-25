export const TokenType = {
  Identifier: "Identifier",
  Number: "Number",
  Boolean: "Boolean",
  String: "String",

  Equals: "==",
  NotEquals: "!=",
  MoreThan: ">",
  LessThan: "<",
  MoreOrEquals: ">=",
  LessOrEquals: "<=",
  And: "and",
  Or: "or",
  Not: "not",

  LeftParen: "(",
  RightParen: ")",

  Eof: "EOF",
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];
export type Token = {
  type: TokenType;
  value: string;
  position: number;
};
