import type { Token } from "@loverry/enums";
import type { SceneMetadata } from "@loverry/ast";
import type { Registries } from "../registries-collector";
export interface Files {
    normilizePath: (path: string) => string;
    readFile: (path: string) => Promise<string>;
}
export interface DslParserOptions {
    readonly tokens: Token[];
    readonly registries: Registries;
    readonly metadata: SceneMetadata;
    readonly file: string;
    readonly files: Files;
}
export declare class DslParser {
    private readonly options;
    constructor(options: DslParserOptions);
    execute(): Promise<import("@loverry/ast").SceneAst>;
}
//# sourceMappingURL=dsl-parser.d.ts.map