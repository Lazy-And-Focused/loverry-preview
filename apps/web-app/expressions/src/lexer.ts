import type { Token } from "./token";
import { TokenType } from "./token";

export class Lexer {
  private readonly _input: string;
  private _current_char: string | null = null;
  private _position: number = 0;

  public constructor(input: string) {
    this._input = input;
    this._current_char = (input.length > 0 ? input[0] : null) || null;
  }

  public execute(): Token[] {
    const tokens: Token[] = [];
    let token = this.nextToken();

    while (token.type !== TokenType.Eof) {
      tokens.push(token);
      token = this.nextToken();
    }

    tokens.push(token);
    return tokens;
  }

  private advance(): string | null {
    this._position++;

    const char = (() => {
      if (this._position < this._input.length) {
        return this._input[this._position] || null;
      }

      return null;
    })();

    this._current_char = char;
    return char;
  }

  private getCurrentChar(): string | null {
    const peekPosition = this._position + 1;
    const peek = (() => {
      if (peekPosition < this._input.length) {
        return this._input[peekPosition] || null;
      }

      return null;
    })();

    return peek;
  }

  private skipWhitespace(): void {
    while (this._current_char && /\s/.test(this._current_char)) {
      this.advance();
    }
  }

  private readIdentifier(): string {
    let result = "";
    while (
      this._current_char &&
      /[a-zA-Z_][a-zA-Z0-9_]*/.test(this._current_char)
    ) {
      result += this._current_char;
      this.advance();
    }

    return result;
  }

  private readNumber(): string {
    let result = "";
    while (this._current_char && /[0-9.]/.test(this._current_char)) {
      result += this._current_char;
      this.advance();
    }

    return result;
  }

  private readString(): string {
    const quote = this._current_char;
    this.advance();

    let result = "";
    while (this._current_char && this._current_char !== quote) {
      if (this._current_char === "\\") {
        const escaped = this.advance();
        if (escaped === quote) {
          result += quote;
        } else if (escaped === "n") {
          result += "\n";
        } else if (escaped === "t") {
          result += "\t";
        } else if (escaped) {
          result += escaped;
        }
      } else {
        result += this._current_char;
      }
      this.advance();
    }

    this.advance();
    return result;
  }

  public nextToken(): Token {
    this.skipWhitespace();

    if (this._current_char === null) {
      return { type: TokenType.Eof, value: "", position: this._position };
    }

    const startPos = this._position;
    switch (this._current_char) {
      case "(":
        this.advance();
        return { type: TokenType.LeftParen, value: "(", position: startPos };

      case ")":
        this.advance();
        return { type: TokenType.RightParen, value: ")", position: startPos };

      case "=":
        if (this.getCurrentChar() === "=") {
          this.advance();
          this.advance();
          return { type: TokenType.Equals, value: "==", position: startPos };
        }

        throw new Error(`Unexpected character '=' at position ${startPos}`);

      case "!":
        if (this.getCurrentChar() === "=") {
          this.advance();
          this.advance();
          return { type: TokenType.NotEquals, value: "!=", position: startPos };
        }

        throw new Error(`Unexpected character '!' at position ${startPos}`);

      case ">":
        if (this.getCurrentChar() === "=") {
          this.advance();
          this.advance();
          return {
            type: TokenType.MoreOrEquals,
            value: ">=",
            position: startPos,
          };
        }

        this.advance();
        return { type: TokenType.MoreThan, value: ">", position: startPos };

      case "<":
        if (this.getCurrentChar() === "=") {
          this.advance();
          this.advance();
          return {
            type: TokenType.LessOrEquals,
            value: "<=",
            position: startPos,
          };
        }

        this.advance();
        return { type: TokenType.LessThan, value: "<", position: startPos };
    }

    if (/[0-9]/.test(this._current_char)) {
      const value = this.readNumber();
      return { type: TokenType.Number, value, position: startPos };
    }

    if (this._current_char === '"' || this._current_char === "'") {
      const value = this.readString();
      return { type: TokenType.String, value, position: startPos };
    }

    if (/[a-zA-Z_]/.test(this._current_char)) {
      const ident = this.readIdentifier();
      if (ident === "true" || ident === "false") {
        return { type: TokenType.Boolean, value: ident, position: startPos };
      }

      switch (ident) {
        case "and":
          return { type: TokenType.And, value: ident, position: startPos };

        case "or":
          return { type: TokenType.Or, value: ident, position: startPos };

        case "not":
          return { type: TokenType.Not, value: ident, position: startPos };

        default:
          return {
            type: TokenType.Identifier,
            value: ident,
            position: startPos,
          };
      }
    }

    throw new Error(
      `Unexpected character '${this._current_char}' at position ${startPos}`,
    );
  }
}
