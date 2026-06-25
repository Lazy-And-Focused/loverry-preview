import type { SourceLocation } from "@loverry/ast";

export class Scanner {
  private readonly _input: string;

  private _position = 0;
  private _line = 1;
  private _column = 1;

  public constructor(input: string) {
    this._input = input;
  }

  public getChar(): string {
    return this._input[this._position] ?? "";
  }

  public advance(): string {
    const char = this.getChar();
    if (char === "\n") {
      this._line++;
      this._column = 1;
    } else {
      this._column++;
    }

    this._position++;
    return char;
  }

  public isEof(): boolean {
    return this._position >= this._input.length;
  }

  public getLocation(): SourceLocation {
    return { file: "", line: this._line, column: this._column };
  }
}
