import type { BackgroundAnimationsRegistry, CharacterAnimationsRegistry, CharactersRegistry, EmotionsRegistry, EventsRegistry, GameEffectsRegistry, VariablesRegistry } from "./types";
export type Registries = {
    characters: CharactersRegistry;
    emotions: EmotionsRegistry;
    variables: VariablesRegistry;
    events: EventsRegistry;
    characterAnimations: CharacterAnimationsRegistry;
    backgroundAnimations: BackgroundAnimationsRegistry;
    gameEffects: GameEffectsRegistry;
};
export type Registry = keyof Registries;
export declare class RegistryLoader {
    private readonly _registry_path;
    constructor(registryPath: string);
    loadAll(): Promise<Registries>;
    execute<const T extends Registry>(registry: T): Promise<Registries[T]>;
    private loadYaml;
}
//# sourceMappingURL=loader.d.ts.map