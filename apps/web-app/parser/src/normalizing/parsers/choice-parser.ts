import type { ChoiceNode, SceneNode, SourceLocation } from "@loverry/ast";
import type { Token } from "@loverry/enums";

import type { NodeParser } from "./node-parser";
import type { MetaReader } from "../meta-reader";
import type { IdGenerator } from "../id-generator";
import type { ErrorsCollector } from "../errors-collectror";

import { TokenType, MetaKeys } from "@loverry/enums";
import { MetaParser } from "./meta-parser";

export type ChoiceParserParseParameters = {
  readonly source: SourceLocation;
  readonly token: Token;
  readonly meta: Map<string, string>;
};

export interface ChoiceParserDependencies {
  readonly metaReader: MetaReader;
  readonly idGenerator: IdGenerator;
  readonly errors: ErrorsCollector;
  readonly nodeParser: NodeParser;
  readonly metaParser: MetaParser;
}

export class ChoiceParser {
  public constructor(private readonly dependencies: ChoiceParserDependencies) {}

  public async execute(file: string): Promise<ChoiceNode | null> {
    const meta = this.dependencies.metaReader;
    const token = meta.consume({
      expectedType: TokenType.choice_line,
    });

    const source = meta.getSourceLocationFromToken(file, token);
    const options: ChoiceNode["options"] = [];
    const firstOption = await this.parseOption({ file, token });
    if (firstOption) {
      options.push(firstOption);
    }

    while (!meta.isEof() && meta.getToken()?.type === TokenType.choice_line) {
      const token = meta.consume({ expectedType: TokenType.choice_line });
      const option = await this.parseOption({ file, token });
      if (!option) {
        continue;
      }

      options.push(option);
    }

    const id = this.dependencies.idGenerator.execute(
      "choice",
      source,
      JSON.stringify(options),
    );
    return {
      id,
      type: "choice",
      options,
      source,
    };
  }

  public async parseOption({
    token,
    file,
  }: {
    token: Token;
    file: string;
  }): Promise<ChoiceNode["options"][number]> {
    const match = token.lowerValue.match(/\*\*выбор:\*\*\s*(.+)/);
    const text = match ? match[1]!.trim() : "";
    const meta = this.dependencies.metaReader.readLines();

    const source = this.dependencies.metaReader.getSourceLocationFromToken(
      file,
      token,
    );
    const id = this.dependencies.idGenerator.execute(
      "ChoiceOption",
      source,
      text,
    );

    const [condition, effects, events] =
      this.dependencies.metaReader.readValues(meta, [
        MetaKeys.condition,
        MetaKeys.effects,
        MetaKeys.events,
      ]);

    const nodes: SceneNode[] = [];

    while (!this.dependencies.metaReader.isEof()) {
      const nextToken = this.dependencies.metaReader.getToken()!;
      const nodeMeta = this.dependencies.metaReader.readLines();
      const nodeSource =
        this.dependencies.metaReader.getSourceLocationFromToken(
          file,
          nextToken,
        );
      const node = await this[nextToken.type]({
        meta: nodeMeta,
        source: nodeSource,
        token: nextToken,
      });

      if (!node) {
        break;
      }

      nodes.push(node);
    }

    return {
      id,
      text,
      nodes,
      condition: await this.dependencies.metaParser[MetaKeys.condition]({
        source,
        token,
        value: condition,
      }),
      effects: await this.dependencies.metaParser[MetaKeys.effects]({
        source,
        token,
        value: effects,
      }),
      events: await this.dependencies.metaParser[MetaKeys.events]({
        source,
        token,
        value: events,
      }),
    };
  }

  public [TokenType.meta_line] = this.emptyMethod;
  public [TokenType.ignored_line] = this.emptyMethod;
  public [TokenType.eof] = this.emptyMethod;
  public [TokenType.empty_line] = this.emptyMethod;

  public [TokenType.callout_background](
    parameters: ChoiceParserParseParameters,
  ) {
    return this.dependencies.nodeParser.callout_background(parameters);
  }

  public [TokenType.callout_character](parameters: ChoiceParserParseParameters) {
    return this.dependencies.nodeParser.callout_character(parameters);
  }

  public [TokenType.callout_effect](parameters: ChoiceParserParseParameters) {
    return this.dependencies.nodeParser.callout_effect(parameters);
  }

  public [TokenType.callout_quote](parameters: ChoiceParserParseParameters) {
    return this.dependencies.nodeParser.callout_quote(parameters);
  }

  public [TokenType.callout_info](parameters: ChoiceParserParseParameters) {
    return this.dependencies.nodeParser.callout_info(parameters);
  }

  public [TokenType.action_line](parameters: ChoiceParserParseParameters) {
    return this.dependencies.nodeParser.action_line(parameters);
  }

  public [TokenType.callout_system](parameters: ChoiceParserParseParameters) {
    return this.dependencies.nodeParser.callout_system(parameters);
  }

  public [TokenType.callout_transition](
    parameters: ChoiceParserParseParameters,
  ) {
    return this.dependencies.nodeParser.callout_transition(parameters);
  }

  public [TokenType.choice_line]({ source }: ChoiceParserParseParameters) {
    this.dependencies.errors.add("Nested choice are not supported", source);
    this.dependencies.metaReader.consume({});
    return null;
  }

  private emptyMethod() {
    return null;
  }
}
