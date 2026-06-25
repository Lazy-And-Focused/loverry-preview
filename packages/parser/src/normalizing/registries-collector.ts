import type {
  BackgroundAnimationsRegistry,
  CharacterAnimationsRegistry,
  CharactersRegistry,
  EmotionsRegistry,
  EventsRegistry,
  GameEffectsRegistry,
  VariablesRegistry,
} from "@loverry/registries";

export type Registries = {
  readonly characters: CharactersRegistry;
  readonly emotions: EmotionsRegistry;
  readonly variables: VariablesRegistry;
  readonly events: EventsRegistry;
  readonly characterAnimations: CharacterAnimationsRegistry;
  readonly backgroundAnimations: BackgroundAnimationsRegistry;
  readonly gameEffects: GameEffectsRegistry;
};

export interface RegistriesCollectorOptions {
  readonly registries: Registries;
}

export class RegistriesCollector implements Registries {
  public constructor(protected readonly options: RegistriesCollectorOptions) {}

  public get characters() {
    return this.options.registries.characters;
  }

  public get emotions() {
    return this.options.registries.emotions;
  }

  public get variables() {
    return this.options.registries.variables;
  }

  public get events() {
    return this.options.registries.events;
  }

  public get characterAnimations() {
    return this.options.registries.characterAnimations;
  }

  public get backgroundAnimations() {
    return this.options.registries.backgroundAnimations;
  }

  public get gameEffects() {
    return this.options.registries.gameEffects;
  }
}
