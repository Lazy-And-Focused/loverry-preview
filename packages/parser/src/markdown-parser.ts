import type { SceneAst, SceneMetadata } from "@loverry/ast";

import { RegistryLoader } from "@loverry/registries";
import { DslLexer } from "@loverry/lexer";

import { DslParser, Files } from "./normalizing";
import { parse as parseYaml } from "yaml";

export class MarkdownParser {
  public constructor(
    public readonly sourceFile: string = "unknown.md",
    public readonly registryPath: string = "./registries",
    private readonly files: Files,
  ) {}

  public async execute(input: string): Promise<SceneAst> {
    const { content, frontmatter } = this.extractFrontmatter(input);
    const metadata = this.buildMetadata(frontmatter);

    const lexer = new DslLexer(content);
    const tokens = lexer.execute();

    const loader = new RegistryLoader(this.registryPath);
    const registries = await loader.loadAll();

    if (!metadata) {
      throw new Error("metadata is not defined in " + this.sourceFile);
    }

    const dslParser = new DslParser({
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
  private extractFrontmatter(input: string): {
    content: string;
    frontmatter: Record<string, any> | null;
  } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = input.match(frontmatterRegex);
    if (!match) {
      return { content: input, frontmatter: null };
    }
    const yamlContent = match[1]!;
    const content = input.slice(match[0].length);
    try {
      const parsed = parseYaml(yamlContent);
      return { content, frontmatter: parsed };
    } catch (err) {
      console.warn(`Failed to parse frontmatter: ${err}`);
      return { content, frontmatter: null };
    }
  }

  /**
   * Преобразует сырой объект frontmatter в SceneMetadata.
   */
  private buildMetadata(
    frontmatter: Record<string, any> | null,
  ): SceneMetadata | null {
    if (!frontmatter) return null;
    const metadata: SceneMetadata = {
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
