import type { SceneAst } from "@loverry/ast";
import { Files } from "./normalizing";
export declare class MarkdownParser {
    readonly sourceFile: string;
    readonly registryPath: string;
    private readonly files;
    constructor(sourceFile: string | undefined, registryPath: string | undefined, files: Files);
    execute(input: string): Promise<SceneAst>;
    /**
     * Извлекает frontmatter из markdown-строки.
     * Возвращает { content: строка без frontmatter, frontmatter: распарсенный объект или null }
     */
    private extractFrontmatter;
    /**
     * Преобразует сырой объект frontmatter в SceneMetadata.
     */
    private buildMetadata;
}
//# sourceMappingURL=markdown-parser.d.ts.map