export type CharacterEntry = {
    name: string;
    surname: string;
    short_name: string;
    pronouns: string;
    color: string;
    avatar: string;
    description: string;
    gender: string;
    age: number;
    relationship: string;
};
export type EmotionEntry = {
    intensity: number;
};
export type VariableEntry = {
    type: "int" | "bool";
    default: number | boolean;
    min?: number;
    max?: number;
    category: string;
    persistent: boolean;
    description?: string;
};
export type AnimationEasing = "linear" | "ease-in" | "ease-out" | "ease-in-out";
export type CharacterAnimationEntry = {
    displayName: string;
    type: string;
    /** В милисекундах */
    duration?: number;
    speed?: number;
    easing?: AnimationEasing;
    spriteSheet?: {
        columns: number;
        rows: number;
        /** Длительность кадра в милисекундах */
        frameDuration: number;
    };
    description?: string;
};
export type BackgroundAnimationEntry = {
    displayName: string;
    type: string;
    speed?: number;
    parameters?: {
        opacity?: number;
        scale?: number;
        color?: string;
    };
    description?: string;
};
export type GameEffectEntry = {
    displayName: string;
    type: string;
    description?: string;
    defaultIntensity?: number;
    /** В милисекундах */
    defaultDuration?: number;
    parameters?: {
        magnitude?: number;
        color?: string;
        speed?: number;
    };
};
export type GameEffectsRegistry = Record<string, GameEffectEntry>;
export type EventEntry = {
    type: "music" | "sound" | "visual" | "system";
    description?: string;
};
export type CharactersRegistry = Record<string, CharacterEntry>;
export type EmotionsRegistry = Record<string, EmotionEntry>;
export type VariablesRegistry = Record<string, VariableEntry>;
export type EventsRegistry = Record<string, EventEntry>;
export type CharacterAnimationsRegistry = Record<string, CharacterAnimationEntry>;
export type BackgroundAnimationsRegistry = Record<string, BackgroundAnimationEntry>;
//# sourceMappingURL=types.d.ts.map