"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownParser = void 0;
const registries_1 = require("@loverry/registries");
const lexer_1 = require("@loverry/lexer");
const normalizing_1 = require("./normalizing");
const yaml_1 = require("yaml");
class MarkdownParser {
    sourceFile;
    registryPath;
    files;
    constructor(sourceFile = "unknown.md", registryPath = "./registries", files) {
        this.sourceFile = sourceFile;
        this.registryPath = registryPath;
        this.files = files;
    }
    async execute(input) {
        const { content, frontmatter } = this.extractFrontmatter(input);
        const metadata = this.buildMetadata(frontmatter);
        const lexer = new lexer_1.DslLexer(content);
        const tokens = lexer.execute();
        const loader = new registries_1.RegistryLoader(this.registryPath);
        const registries = await loader.loadAll();
        if (!metadata) {
            throw new Error("metadata is not defined in " + this.sourceFile);
        }
        const dslParser = new normalizing_1.DslParser({
            file: this.sourceFile,
            registries,
            metadata,
            tokens,
            files: this.files,
        });
        const sceneAst = dslParser.execute();
        return sceneAst;
    }
    /**
     * Извлекает frontmatter из markdown-строки.
     * Возвращает { content: строка без frontmatter, frontmatter: распарсенный объект или null }
     */
    extractFrontmatter(input) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = input.match(frontmatterRegex);
        if (!match) {
            return { content: input, frontmatter: null };
        }
        const yamlContent = match[1];
        const content = input.slice(match[0].length);
        try {
            const parsed = (0, yaml_1.parse)(yamlContent);
            return { content, frontmatter: parsed };
        }
        catch (err) {
            console.warn(`Failed to parse frontmatter: ${err}`);
            return { content, frontmatter: null };
        }
    }
    /**
     * Преобразует сырой объект frontmatter в SceneMetadata.
     */
    buildMetadata(frontmatter) {
        if (!frontmatter)
            return null;
        const metadata = {
            id: frontmatter.id || this.sourceFile.replace(/\.md$/, ""),
            dslVersion: frontmatter.dsl_version || "2.2",
            chapter: frontmatter.chapter,
            act: frontmatter.act,
            day: frontmatter.day,
            order: frontmatter.order,
            characters: frontmatter.characters,
        };
        return metadata;
    }
}
exports.MarkdownParser = MarkdownParser;
//# sourceMappingURL=markdown-parser.js.map