import type { Token } from "@loverry/enums";
import type { MetaParser } from "./meta-parser";
import type {
  ActionNode,
  BackgroundNode,
  CharacterNode,
  ChoiceNode,
  DialogueNode,
  EffectNode,
  GetSceneNode,
  SceneAst,
  SceneMetadata,
  SceneNode,
  SourceLocation,
  SystemNode,
  ThoughtNode,
  TransitionNode,
} from "@loverry/ast";

import { MetaKeys, Properties, TokenType } from "@loverry/enums";
import { IdGenerator } from "../id-generator";
import { ChoiceParser } from "./choice-parser";
import { ErrorsCollector } from "../errors-collectror";
import { MetaReader } from "../meta-reader";

export interface NodeParserDependencies {
  readonly metaReader: MetaReader;
  readonly idGenerator: IdGenerator;
  readonly errors: ErrorsCollector;
  readonly metaParser: MetaParser;
}

export interface NodeParserOptions {
  readonly metadata: SceneMetadata;
}

export type NodeParserBaseParseParameters = {
  readonly meta: Map<string, string>;
  readonly source: SourceLocation;
};

export type NodeParserParseParameters = NodeParserBaseParseParameters & {
  readonly token: Token;
};

export type NodeParserType = {
  readonly [key in TokenType]: (parameters: NodeParserParseParameters) => unknown;
};

export class NodeParser implements NodeParserType {
  public readonly choiceParser: ChoiceParser;

  public constructor(
    private readonly dependencies: NodeParserDependencies,
    private readonly options: NodeParserOptions,
  ) {
    this.choiceParser = new ChoiceParser({
      ...dependencies,
      nodeParser: this,
    });
  }

  public async execute(file: string): Promise<SceneAst> {
    const nodes: SceneNode[] = [];
    const metaReader = this.dependencies.metaReader;

    while (!metaReader.isEof()) {
      const token = metaReader.getToken()!;
      const meta = metaReader.readLines();
      const source = metaReader.getSourceLocationFromToken(file, token);

      if (!this[token.type]) {
        this.dependencies.errors.add(`Unexpected token ${token.type}`, source);
        this.consume();
        continue;
      }

      const method = this[token.type] as (
        params: NodeParserParseParameters,
      ) => Promise<SceneNode | null>;
      const node = await method.call(this, {
        meta,
        source,
        token,
      });

      if (!node) {
        continue;
      }

      nodes.push(node);
    }

    if (this.dependencies.errors.hasErrors()) {
      const errors = this.dependencies.errors
        .getErrors()
        .map((error) => {
          return `[${error.file}:${error.line}:${error.column}] ${error.message}`;
        })
        .join("\n");

      throw new Error(`Normalization failed:\n${errors}`);
    }

    return {
      metadata: this.options.metadata,
      nodes: nodes,
      source: this.dependencies.metaReader.getSourceLocation(file, {
        line: 0,
        column: 0,
      }),
    };
  }

  public [TokenType.empty_line] = this.consume;
  public [TokenType.meta_line] = this.consume;
  public [TokenType.ignored_line] = this.consume;
  
  public [TokenType.eof] = () => null;

  public async [TokenType.action_line]({
    token,
    source,
  }: NodeParserParseParameters): Promise<ActionNode | null> {
    this.dependencies.metaReader.consume({
      expectedType: TokenType.action_line,
    });
    const text = token.value.replace(/^>\s?/, "").trim();
    const id = this.dependencies.idGenerator.execute("action", source, text);

    return {
      id,
      type: "action",
      text,
      source,
    };
  }

  public async [TokenType.callout_quote](
    parameters: NodeParserParseParameters,
  ): Promise<DialogueNode | null> {
    this.dependencies.metaReader.consume({
      expectedType: TokenType.callout_quote,
    });

    return this.build(
      [
        MetaKeys.character,
        MetaKeys.emotion,
        MetaKeys.condition,
        MetaKeys.action,
        MetaKeys.effects,
        MetaKeys.events,
        MetaKeys.text,
      ],
      parameters,
      "dialogue",
      [MetaKeys.character],
    );
  }

  public async [TokenType.callout_info](
    parameters: NodeParserParseParameters,
  ): Promise<ThoughtNode | null> {
    this.dependencies.metaReader.consume({
      expectedType: TokenType.callout_info,
    });
    return this.build(
      [
        MetaKeys.character,
        MetaKeys.condition,
        MetaKeys.action,
        MetaKeys.effects,
        MetaKeys.events,
        MetaKeys.text,
      ],
      parameters,
      "thought",
      [MetaKeys.character],
    );
  }

  public async [TokenType.callout_system](
    parameters: NodeParserParseParameters,
  ): Promise<SystemNode | null> {
    this.dependencies.metaReader.consume({
      expectedType: TokenType.callout_system,
    });
    return this.build(
      [
        MetaKeys.severity,
        MetaKeys.condition,
        MetaKeys.effects,
        MetaKeys.events,
        MetaKeys.text,
      ],
      parameters,
      "system",
      [],
    );
  }

  public async [TokenType.callout_transition](
    parameters: NodeParserParseParameters,
  ): Promise<TransitionNode | null> {
    this.dependencies.metaReader.consume({
      expectedType: TokenType.callout_transition,
    });
    return this.build(
      [
        MetaKeys.target,
        MetaKeys.mode,
        MetaKeys.condition,
        MetaKeys.effects,
        MetaKeys.events,
      ],
      parameters,
      "transition",
      [],
    );
  }

  public async [TokenType.choice_line](
    parameters: NodeParserParseParameters,
  ): Promise<ChoiceNode | null> {
    return this.choiceParser.execute(parameters.source.file);
  }

  public async [TokenType.callout_background](
    parameters: NodeParserParseParameters,
  ): Promise<BackgroundNode | null> {
    this.dependencies.metaReader.consume({
      expectedType: TokenType.callout_background,
    });
    return this.build(
      [
        MetaKeys.file,
        MetaKeys.transition,
        MetaKeys.animation,
        MetaKeys.condition,
      ],
      parameters,
      "background",
      [MetaKeys.file],
    );
  }

  public async [TokenType.callout_character](
    parameters: NodeParserParseParameters,
  ): Promise<CharacterNode | null> {
    this.dependencies.metaReader.consume({
      expectedType: TokenType.callout_character,
    });
    return this.build(
      [
        MetaKeys.character,
        MetaKeys.sprite,
        MetaKeys.position,
        MetaKeys.layer,
        MetaKeys.hide,
        MetaKeys.animation,
        MetaKeys.condition,
        MetaKeys.emotion,
      ],
      parameters,
      "character",
      [MetaKeys.character, MetaKeys.sprite, MetaKeys.position],
    );
  }

  public async [TokenType.callout_effect](
    parameters: NodeParserParseParameters,
  ): Promise<EffectNode | null> {
    this.dependencies.metaReader.consume({
      expectedType: TokenType.callout_effect,
    });
    return this.build(
      [
        MetaKeys.effects,
        MetaKeys.intensity,
        MetaKeys.duration,
        MetaKeys.condition,
      ],
      parameters,
      "effect",
      [MetaKeys.effects],
    );
  }

  private consume() {
    this.dependencies.metaReader.consume({});
    return null;
  }

  private async build<
    const Keys extends MetaKeys[],
    Type extends SceneNode["type"],
    Required extends MetaKeys[],
  >(
    keys: Keys,
    parameters: NodeParserParseParameters,
    type: Type,
    required: Required,
  ): Promise<GetSceneNode<Type> | null> {
    const meta = this.dependencies.metaReader.readLines();
    const data = await this.dependencies.metaParser.execute(
      {
        ...parameters,
        meta,
      },
      keys,
    );

    const isNull = required.some((key) => {
      const property = Properties[key] as (typeof Properties)[Keys[number]];
      const propertyExists = property in data;
      if (!propertyExists) {
        return false;
      }

      const dataValue = data[property];
      if (!dataValue) {
        this.dependencies.errors.add(
          `Missing ${property} in "${type}"-token`,
          parameters.source,
        );
      }

      return !dataValue;
    });

    if (isNull) {
      return null;
    }

    const id = this.dependencies.idGenerator.execute(
      type,
      parameters.source,
      JSON.stringify(data),
    );

    return {
      id,
      type,
      ...data,
    } as GetSceneNode<Type>;
  }
}
