import type { CharactersRegistry, EmotionsRegistry } from "@loverry/registries";
import type {
  CharacterId,
  EmotionId,
  EventId,
  RuntimeValue,
  SourceLocation,
  VariableId,
} from "@loverry/ast";

import type { Files } from "./dsl-parser";
import type { Token } from "@loverry/enums";
import { Parser } from "@loverry/expressions";

import { MetaKeys, Properties, TokenType } from "@loverry/enums";
import { ErrorsCollector } from "../errors-collectror";
import { MetaReader } from "../meta-reader";
import { CoreValidator } from "../validators/core-validator";
import { RegistriesCollector } from "../registries-collector";
import { IdGenerator } from "../id-generator";

import { join } from "node:path";

export type MetaParserBaseParseParameters = {
  readonly value: string | undefined;
  readonly source: SourceLocation;
};

export type MetaParserParseParameters = MetaParserBaseParseParameters & {
  readonly token: Token;
};

export type MetaParserType = {
  readonly [key in MetaKeys]: (
    parameters: MetaParserParseParameters,
  ) => unknown;
};

export interface MetaParserDependencies {
  readonly errors: ErrorsCollector;
  readonly metaReader: MetaReader;
  readonly validator: CoreValidator;
  readonly idGenerator: IdGenerator;
  readonly registries: RegistriesCollector;
  readonly files: Files;
}

export class MetaParser implements MetaParserType {
  public constructor(private readonly dependencies: MetaParserDependencies) {}

  public async execute<const Keys extends MetaKeys[]>(
    {
      token,
      meta,
      source,
    }: {
      token: Token;
      meta: Map<string, string>;
      source: SourceLocation;
    },
    keys: Keys,
  ) {
    const values = this.dependencies.metaReader.readValues(meta, keys);
    const object = {} as {
      [Key in Keys[number] as (typeof Properties)[Key]]: ReturnType<
        (typeof this)[Key]
      >;
    };

    for (const index in keys) {
      const key = keys[index]!;
      const value = values[index];
      const data = (await this[key]({ value, source, token })) as ReturnType<
        (typeof this)[typeof key]
      >;

      const property = Properties[key];
      (object as Record<typeof property, ReturnType<(typeof this)[typeof key]>>)[
        property
      ] = data;
    }

    return object;
  }

  public async [MetaKeys.target]({ value, source }: MetaParserParseParameters) {
    if (!value) {
      this.dependencies.errors.add("Target is not defined in file", source);
      return undefined;
    }

    const target = (() => {
      const match = value.match(/\[\[(.*?)\]\]/);
      if (!match) {
        return value;
      }
      return match[1]!;
    })();

    const targetId = await this.dependencies.metaReader.extractIdFromTarget({
      directory: this.dependencies.files.normilizePath(join(source.file, "..")),
      target,
    });

    return targetId;
  }

  public async [MetaKeys.transition]({ value }: MetaParserParseParameters) {
    return value;
  }

  public async [MetaKeys.animation]({
    value,
    source,
    token,
  }: MetaParserParseParameters) {
    if (!value) return undefined;

    const registry = this.getAnimationRegistry(token);
    if (!registry[value]) {
      this.dependencies.errors.add(`Unknown animation "${value}"`, source);
      return undefined;
    }

    return value;
  }

  public async [MetaKeys.condition]({
    value,
    source,
  }: MetaParserParseParameters) {
    if (!value) return undefined;
    try {
      return Parser.execute(value);
    } catch (err) {
      this.dependencies.errors.add(
        `Failed to parse condition "${value}": ${err}`,
        source,
      );
      return undefined;
    }
  }

  public async [MetaKeys.events]({ value, source }: MetaParserParseParameters) {
    if (!value) return undefined;

    const parts = value.trim().split(/\s+/);
    const id = parts[0]!;
    if (!this.dependencies.registries.events[id]) {
      this.dependencies.errors.add(`Unknown event "${id}"`, source);
      return undefined;
    }

    const args = parts.slice(1).map((a) => this.parseEventArgument(a));
    return [{ id: id as EventId, arguments: args }];
  }

  public async [MetaKeys.mode]({ value }: MetaParserParseParameters) {
    if (!value) return undefined;
    return ["jump", "call", "return"].includes(value) ? value : undefined;
  }

  public async [MetaKeys.effects]({
    value,
    source,
  }: MetaParserParseParameters) {
    if (!value) return undefined;

    const match = value.match(/^(\w+)\s*([+\-]?=)\s*(.+)$/);
    if (!match) {
      this.dependencies.errors.add(`Invalid effect syntax: "${value}"`, source);
      return undefined;
    }

    const variable = match[1]!;
    const operator = match[2] as "=" | "+=" | "-=";
    const valueString = match[3]!.trim();

    if (!this.dependencies.registries.variables[variable]) {
      this.dependencies.errors.add(`Unknown variable "${variable}"`, source);
      return undefined;
    }

    let runtimeValue: RuntimeValue;
    if (/^-?\d+(\.\d+)?$/.test(valueString)) {
      runtimeValue = parseFloat(valueString);
    } else if (valueString === "true") {
      runtimeValue = true;
    } else if (valueString === "false") {
      runtimeValue = false;
    } else {
      runtimeValue = valueString;
    }

    return [
      {
        variable: variable as VariableId,
        operator,
        value: runtimeValue,
        source,
      },
    ];
  }

  public async [MetaKeys.format]({ value }: MetaParserBaseParseParameters) {
    if (!value) {
      return "real";
    }

    return ["real", "text", "voice"].includes(value) ? value : undefined;
  }

  public async [MetaKeys.text]({ value }: MetaParserParseParameters) {
    return value || "";
  }

  public async [MetaKeys.severity]({ value }: MetaParserParseParameters) {
    if (!value) return undefined;
    return ["info", "warning", "error"].includes(value) ? value : undefined;
  }

  public async [MetaKeys.action]({ value }: MetaParserParseParameters) {
    return value;
  }

  public async [MetaKeys.character]({
    value,
    source,
  }: MetaParserParseParameters) {
    return this.parseRegistryValue<CharacterId>(
      { value, source },
      {
        name: "character",
        registry: this.dependencies.registries.characters,
        isOption: false,
      },
    );
  }

  public async [MetaKeys.sprite]({ value, source }: MetaParserParseParameters) {
    if (!value) {
      this.dependencies.errors.add("Sprite missing file", source);
      return undefined;
    }
    return value;
  }

  public async [MetaKeys.file]({ value, source }: MetaParserParseParameters) {
    if (!value) {
      this.dependencies.errors.add("Background missing file", source);
      return undefined;
    }
    return value;
  }

  public async [MetaKeys.hide]({ value, source }: MetaParserParseParameters) {
    if (!value) return undefined;
    const lower = value.toLowerCase();
    if (["t", "д", "да", "true"].includes(lower)) return true;
    if (["f", "н", "нет", "false"].includes(lower)) return false;
    this.dependencies.errors.add(
      `Invalid hide value: "${value}". Use true/false`,
      source,
    );
    return undefined;
  }

  public async [MetaKeys.position]({
    value,
    source,
  }: MetaParserParseParameters) {
    if (!value) return undefined;
    const num = Number(value);
    if (!isNaN(num)) return num;
    const normalized = value.toLowerCase();
    if (["left", "center", "right"].includes(normalized)) {
      return normalized as "left" | "center" | "right";
    }
    this.dependencies.errors.add(
      `Invalid position: "${value}". Allowed: left, center, right`,
      source,
    );
    return undefined;
  }

  public async [MetaKeys.layer]({ value, source }: MetaParserParseParameters) {
    if (!value) return undefined;
    return this.parseNumber({ value, source });
  }

  public async [MetaKeys.emotion]({
    value,
    source,
  }: MetaParserParseParameters) {
    return this.parseRegistryValue<EmotionId>(
      { value, source },
      {
        name: "emotion",
        registry: this.dependencies.registries.emotions,
        isOption: true,
      },
    );
  }

  public async [MetaKeys.intensity]({
    value,
    source,
  }: MetaParserParseParameters) {
    if (!value) return undefined;
    const intensity = this.parseNumber({ value, source });
    if (intensity === undefined) return undefined;
    if (intensity < 0 || intensity > 1) {
      this.dependencies.errors.add(
        `Intensity must be between 0 and 1, got ${intensity}`,
        source,
      );
      return undefined;
    }
    return intensity;
  }

  public async [MetaKeys.duration]({
    value,
    source,
  }: MetaParserParseParameters) {
    if (!value) return undefined;
    const duration = this.parseNumber({ value, source });
    if (duration === undefined) return undefined;
    if (duration <= 0) {
      this.dependencies.errors.add(
        `Duration must be positive, got ${duration}`,
        source,
      );
      return undefined;
    }
    return duration;
  }

  private parseEventArgument(argument: string): RuntimeValue {
    if (/^-?\d+(\.\d+)?$/.test(argument)) return parseFloat(argument);
    if (argument === "true") return true;
    if (argument === "false") return false;
    return argument;
  }

  private async parseRegistryValue<T>(
    { value, source }: MetaParserBaseParseParameters,
    options: {
      registry: CharactersRegistry | EmotionsRegistry;
      name: "character" | "emotion";
      isOption: boolean;
    },
  ) {
    if (!options.isOption && !value) {
      this.dependencies.errors.add(`${options.name} missing`, source);
      return undefined;
    }
    if (!value) return undefined;
    if (!options.registry[value]) {
      this.dependencies.errors.add(`Unknown ${options.name} "${value}"`, source);
      return undefined;
    }
    return value as T;
  }

  private getAnimationRegistry(token: Token) {
    if (token.type === TokenType.callout_background) {
      return this.dependencies.registries.backgroundAnimations;
    }
    if (token.type === TokenType.callout_character) {
      return this.dependencies.registries.characterAnimations;
    }
    throw new Error("Bad token type");
  }

  private parseNumber({ value, source }: MetaParserBaseParseParameters) {
    const number = Number(value);
    if (isNaN(number)) {
      this.dependencies.errors.add(`"${value}" is not a number`, source);
      return undefined;
    }
    return number;
  }
}