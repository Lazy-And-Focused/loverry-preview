import type { Token } from "@loverry/enums";
import type { SourceLocation } from "@loverry/ast";
import type { Files } from "./parsers";
import { TokenType } from "@loverry/enums";
import { MetaKeys } from "@loverry/enums";
export interface MetaReaderOptions {
    readonly tokens: Token[];
    readonly startPosition: number;
}
export interface MetaReaderDependencies {
    readonly files: Files;
}
export declare class MetaReader {
    readonly options: MetaReaderOptions;
    private readonly dependencies;
    private _position;
    constructor(options: MetaReaderOptions, dependencies: MetaReaderDependencies);
    extractIdFromTarget({ directory, target, }: {
        directory: string;
        target: string;
    }): Promise<string>;
    getSourceLocation(file: string, source: {
        line: number;
        column: number;
    }): SourceLocation;
    getSourceLocationFromToken(file: string, token: Token): SourceLocation;
    readLines(): Map<string, string>;
    readValues(meta: Map<string, string>, keys: MetaKeys[]): (string | undefined)[];
    getToken(position?: number): Token | null;
    consume({ expectedType }: {
        expectedType?: TokenType;
    }): Token;
    isEof(position?: number): boolean;
    private extractFrontmatter;
}
//# sourceMappingURL=meta-reader.d.ts.map