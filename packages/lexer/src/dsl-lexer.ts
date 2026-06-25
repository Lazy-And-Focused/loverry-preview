import type { Token } from "@loverry/enums";
import { TokenType, detectTokenType } from "@loverry/enums";

export class DslLexer {
  private readonly _lines: string[];
  private _current_line = 0;

  public constructor(input: string) {
    this._lines = input.split(/\r?\n/);
  }

  public execute(): Token[] {
    const tokens: Token[] = [];
    let token = this.nextToken();

    while (token.type !== TokenType.eof) {
      tokens.push(token);
      token = this.nextToken();
    }

    tokens.push(token);
    return tokens;
  }

  public nextToken(): Token {
    if (this.isEof()) {
      return this.createToken(TokenType.eof, "", "", 0);
    }

    const line = this.getLine()!.trim();
    const lowerLine = line.toLowerCase();
    const column = lowerLine.length - lowerLine.length;

    const tokenType = detectTokenType(lowerLine);
    this.advance();
    
    return this.createToken(tokenType ?? TokenType.ignored_line, lowerLine, line, column);
  }

  private getLine(): string | undefined {
    return this._lines[this._current_line];
  }

  private advance(): void {
    this._current_line++;
  }

  private isEof(): boolean {
    return this._current_line >= this._lines.length;
  }

  private createToken(type: TokenType, value: string, rawValue: string, column: number): Token {
    return {
      type,
      lowerValue: value,
      value: rawValue,
      line: this._current_line,
      column
    };
  }
}