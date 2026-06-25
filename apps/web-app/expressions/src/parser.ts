import type { Token } from "./token";
import type {
  Expression,
  LiteralExpression,
  VariableReferenceExpression,
  BinaryExpression,
  UnaryExpression,
} from "@loverry/ast";

import { TokenType } from "./token";
import { Lexer } from "./lexer";

export class Parser {
  private static readonly _precedence: Map<TokenType, number> = new Map([
    [TokenType.Or, 10],
    [TokenType.And, 20],
    [TokenType.Equals, 30],
    [TokenType.NotEquals, 30],
    [TokenType.MoreThan, 40],
    [TokenType.LessThan, 40],
    [TokenType.MoreOrEquals, 40],
    [TokenType.LessOrEquals, 40],
    [TokenType.Not, 50],
  ]);

  public static execute(input: string): Expression {
    const lexer = new Lexer(input);
    const tokens = lexer.execute();
    const parser = new Parser(tokens);

    return parser.execute();
  }

  private _tokens: Token[];
  private _current: number = 0;

  public constructor(tokens: Token[]) {
    this._tokens = tokens;
  }

  public execute(): Expression {
    const expression = this.parseExpression(0);
    const token = this.getToken();
    if (token.type !== TokenType.Eof) {
      throw new Error(`Unexpected token after expression: ${token.type}`);
    }

    return expression;
  }

  private getToken(): Token {
    const token = this._tokens[this._current];
    if (!token) {
      throw new Error("Token is not defined");
    }

    return token;
  }

  private consume(type?: TokenType): Token {
    const token = this.getToken();
    if (type && token.type !== type) {
      throw new Error(
        `Expected ${type}, got ${token.type} at position ${token.position}`,
      );
    }

    this._current++;
    return token;
  }

  private getPrecedence(type: TokenType): number {
    return Parser._precedence.get(type) ?? 0;
  }

  private parseLiteral(): Expression {
    const token = this.consume();
    let value: string | number | boolean = token.value;

    if (token.type === TokenType.Number) {
      value = parseFloat(token.value);
    } else if (token.type === TokenType.Boolean) {
      value = token.value === "true";
    } else if (token.type === TokenType.String) {
      // строка
    } else {
      throw new Error(`Unexpected token for literal: ${token.type}`);
    }

    const expression: LiteralExpression = {
      type: "literal",
      value,
    };
    return expression;
  }

  private parseVariable(): Expression {
    const token = this.consume(TokenType.Identifier);
    const expression: VariableReferenceExpression = {
      type: "variable_reference",
      variable: token.value,
    };

    return expression;
  }

  private parseGrouped(): Expression {
    this.consume(TokenType.LeftParen);
    const expression = this.parseExpression(0);
    this.consume(TokenType.RightParen);

    return expression;
  }

  private parsePrefixNot(): Expression {
    const precedence = this.getPrecedence(TokenType.Not);
    const operand = this.parseExpression(precedence);

    const expression: UnaryExpression = {
      type: "unary",
      operator: "not",
      operand,
    };
    return expression;
  }

  private parseBinary(
    left: Expression,
    precedence: number,
    opType: TokenType,
  ): Expression {
    const right = this.parseExpression(precedence);
    let operator: BinaryExpression["operator"];

    switch (opType) {
      case TokenType.Equals:
        operator = "==";
        break;
      case TokenType.NotEquals:
        operator = "!=";
        break;
      case TokenType.MoreThan:
        operator = ">";
        break;
      case TokenType.LessThan:
        operator = "<";
        break;
      case TokenType.MoreOrEquals:
        operator = ">=";
        break;
      case TokenType.LessOrEquals:
        operator = "<=";
        break;
      case TokenType.And:
        operator = "and";
        break;
      case TokenType.Or:
        operator = "or";
        break;
      default:
        throw new Error(`Unknown binary operator ${opType}`);
    }

    const expression: BinaryExpression = {
      type: "binary",
      operator,
      left,
      right,
    };

    return expression;
  }

  private parseExpression(minPrecedence: number): Expression {
    let left: Expression;
    const token = this.getToken();

    switch (token.type) {
      case TokenType.Number:
      case TokenType.Boolean:
      case TokenType.String:
        left = this.parseLiteral();
        break;
      case TokenType.Identifier:
        left = this.parseVariable();
        break;
      case TokenType.LeftParen:
        left = this.parseGrouped();
        break;
      case TokenType.Not:
        left = this.parsePrefixNot();
        break;
      default:
        throw new Error(
          `Unexpected token at start of expression: ${token.type}`,
        );
    }

    while (true) {
      const nextToken = this.getToken();
      if (nextToken.type === TokenType.Eof) {
        break;
      }

      const precedence = this.getPrecedence(nextToken.type);
      if (precedence < minPrecedence) {
        break;
      }

      switch (nextToken.type) {
        case TokenType.Equals:
        case TokenType.NotEquals:
        case TokenType.MoreThan:
        case TokenType.LessThan:
        case TokenType.MoreOrEquals:
        case TokenType.LessOrEquals:
        case TokenType.And:
        case TokenType.Or:
          left = this.parseBinary(left, precedence, nextToken.type);
          break;
        default:
          return left;
      }
    }

    return left;
  }
}
