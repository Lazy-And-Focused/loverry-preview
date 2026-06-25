import type { Token } from "@loverry/enums";
import type { SceneMetadata } from "@loverry/ast";
import type { Registries } from "../registries-collector";

import { RegistriesCollector } from "../registries-collector";
import { ErrorsCollector } from "../errors-collectror";
import { NodeParser } from "./node-parser";
import { IdGenerator } from "../id-generator";
import { MetaParser } from "./meta-parser";
import { MetaReader } from "../meta-reader";
import { CoreValidator } from "../validators/core-validator";

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

export class DslParser {
  public constructor(private readonly options: DslParserOptions) {}

  public execute() {
    const errors = new ErrorsCollector();
    const registries = new RegistriesCollector({
      registries: this.options.registries,
    });

    const idGenerator = new IdGenerator(this.options.metadata.id);
    const metaReader = new MetaReader(
      {
        tokens: this.options.tokens,
        startPosition: 0,
      },
      {
        files: this.options.files,
      },
    );

    const validator = new CoreValidator({
      errors,
      registries,
    });

    const metaParser = new MetaParser({
      errors,
      idGenerator,
      metaReader,
      registries,
      validator,
      files: this.options.files,
    });

    const nodeParser = new NodeParser(
      {
        errors,
        idGenerator,
        metaParser,
        metaReader,
      },
      {
        metadata: this.options.metadata,
      },
    );

    return nodeParser.execute(this.options.file);
  }
}
