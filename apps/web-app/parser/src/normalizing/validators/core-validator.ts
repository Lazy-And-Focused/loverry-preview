import type { CharacterId, EmotionId, SourceLocation } from "@loverry/ast";
import type { ErrorsCollector } from "../errors-collectror";
import type { RegistriesCollector } from "../registries-collector";

export interface CoreValidatorDependencies {
  readonly errors: ErrorsCollector;
  readonly registries: RegistriesCollector;
}

export class CoreValidator {
  public constructor(
    private readonly dependencies: CoreValidatorDependencies,
  ) {}

  public validateCharacter({
    name,
    source,
  }: {
    name: string;
    source: SourceLocation;
  }): CharacterId | null {
    if (!this.dependencies.registries.characters[name]) {
      this.dependencies.errors.add(`Unknown character "${name}"`, source);
      return null;
    }

    return name as CharacterId;
  }

  public validateEmotion({
    name,
    source,
  }: {
    name: string;
    source: SourceLocation;
  }): EmotionId | null {
    if (!this.dependencies.registries.emotions[name]) {
      this.dependencies.errors.add(`Unknown emotion "${name}"`, source);
      return null;
    }

    return name as EmotionId;
  }
}
