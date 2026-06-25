import type { Effect, Expression } from "@loverry/ast";
import { GameStateChange, GameStateMap, GameStateValue } from "./types";
export declare class GameState {
    private readonly _variables;
    private readonly _listeners;
    constructor(initialState?: GameStateMap);
    get variables(): GameStateMap;
    get(key: string): GameStateValue | undefined;
    set(key: string, value: GameStateValue): void;
    applyEffects(effects: Effect[]): void;
    evaluateCondition(condition?: Expression): boolean;
    onStateChanged(callback: (changes: GameStateChange[]) => void): void;
    private notifyChanges;
}
//# sourceMappingURL=game-state.d.ts.map