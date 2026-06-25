import type { SourceLocation } from "@loverry/ast";

export type NormalizationError = {
  readonly message: string;
  readonly file: string;
  readonly line: number;
  readonly column: number;
};

export class ErrorsCollector {
  private errors: NormalizationError[] = [];

  public constructor() {}

  public add(message: string, source: SourceLocation): void {
    this.errors.push({
      message,
      file: source.file,
      line: source.line,
      column: source.column,
    });
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  public getErrors(): NormalizationError[] {
    return this.errors;
  }

  public execute(): void {
    if (this.errors.length) {
      return;
    }

    const errorMessages = this.errors
      .map((e) => `[${e.file}:${e.line}:${e.column}] ${e.message}`)
      .join("\n");

    throw new Error(`Normalization failed:\n${errorMessages}`);
  }
}
