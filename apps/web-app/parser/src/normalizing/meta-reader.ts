import type { Token } from "@loverry/enums";
import type { SourceLocation } from "@loverry/ast";
import type { Files } from "./parsers";

import { TokenType } from "@loverry/enums";

import { join } from "node:path";
import { parse } from "yaml";

import { MetaKeys } from "@loverry/enums";

export interface MetaReaderOptions {
  readonly tokens: Token[];
  readonly startPosition: number;
}

export interface MetaReaderDependencies {
  readonly files: Files;
}

export class MetaReader {
  private _position: number;

  public constructor(
    public readonly options: MetaReaderOptions,
    private readonly dependencies: MetaReaderDependencies,
  ) {
    this._position = options.startPosition;
  }

  public async extractIdFromTarget({
    directory,
    target,
  }: {
    directory: string;
    target: string;
  }): Promise<string> {
    const link = target.split("|")[0]!;
    const path = this.dependencies.files.normilizePath(
      join(directory, `${link}.md`),
    );
    const file = await this.dependencies.files.readFile(path);

    const metadata = this.extractFrontmatter(file);
    if ("id" in metadata) {
      return metadata.id as string;
    }

    return target;
  }

  public getSourceLocation(
    file: string,
    source: { line: number; column: number },
  ): SourceLocation {
    return { file, line: source.line + 1, column: source.column + 1 };
  }

  public getSourceLocationFromToken(
    file: string,
    token: Token,
  ): SourceLocation {
    return { file, line: token.line + 1, column: token.column + 1 };
  }

  public readLines(): Map<string, string> {
    const metaMap = new Map<string, string>();

    while (!this.isEof() && this.getToken()?.type === TokenType.meta_line) {
      const token = this.consume({
        expectedType: TokenType.meta_line,
      });

      const line = token.value.trim();
      const match = line.match(/^>\s*\*\*([^:]+):\*\*\s*(.*)$/);
      if (!match) {
        console.warn(`Failed to parse meta line: "${line}"`);
        continue;
      }

      const key = match[1]!.trim().toLowerCase();
      const value = match[2]!.trim();

      metaMap.set(key, value);
    }

    return metaMap;
  }

  public readValues(meta: Map<string, string>, keys: MetaKeys[]) {
    return keys.map((key) => meta.get(key));
  }

  public getToken(position: number = this._position): Token | null {
    return this.options.tokens[position] || null;
  }

  public consume({ expectedType }: { expectedType?: TokenType }) {
    const token = this.getToken();
    if (!token) {
      throw new Error("Unexpected end of file");
    }

    if (expectedType !== undefined && token.type !== expectedType) {
      throw new Error(
        `Expected token type ${expectedType}, got ${token.type} at line ${token.line}`,
      );
    }

    this._position++;

    return token;
  }

  public isEof(position: number = this._position): boolean {
    return this.getToken(position)?.type === TokenType.eof;
  }

  private extractFrontmatter(content: string): any {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (!match) {
      return null;
    }

    try {
      return parse(match[1]!);
    } catch {
      return null;
    }
  }
}
