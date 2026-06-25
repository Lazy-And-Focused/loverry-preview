import type { CharacterId, EmotionId, SourceLocation } from "@loverry/ast";
import type { ErrorsCollector } from "../errors-collectror";
import type { RegistriesCollector } from "../registries-collector";
export interface CoreValidatorDependencies {
    readonly errors: ErrorsCollector;
    readonly registries: RegistriesCollector;
}
export declare class CoreValidator {
    private readonly dependencies;
    constructor(dependencies: CoreValidatorDependencies);
    validateCharacter({ name, source, }: {
        name: string;
        source: SourceLocation;
    }): CharacterId | null;
    validateEmotion({ name, source, }: {
        name: string;
        source: SourceLocation;
    }): EmotionId | null;
}
//# sourceMappingURL=core-validator.d.ts.map