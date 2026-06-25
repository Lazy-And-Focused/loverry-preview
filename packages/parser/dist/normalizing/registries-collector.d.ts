import type { BackgroundAnimationsRegistry, CharacterAnimationsRegistry, CharactersRegistry, EmotionsRegistry, EventsRegistry, GameEffectsRegistry, VariablesRegistry } from "@loverry/registries";
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
export declare class RegistriesCollector implements Registries {
    protected readonly options: RegistriesCollectorOptions;
    constructor(options: RegistriesCollectorOptions);
    get characters(): CharactersRegistry;
    get emotions(): EmotionsRegistry;
    get variables(): VariablesRegistry;
    get events(): EventsRegistry;
    get characterAnimations(): CharacterAnimationsRegistry;
    get backgroundAnimations(): BackgroundAnimationsRegistry;
    get gameEffects(): GameEffectsRegistry;
}
//# sourceMappingURL=registries-collector.d.ts.map