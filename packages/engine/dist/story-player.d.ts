import type { SceneNode } from "@loverry/ast";
import type { RuntimeScene, StoryPlayerEvents } from "./types";
import type { SceneLoader } from "./scene-loader";
import type { GameState } from "./game-state";
export interface CurrentData {
    sceneId: string | null;
    scene: RuntimeScene | null;
    nodeIndex: number;
}
export interface StoryPlayerDependencies {
    sceneLoader: SceneLoader;
    gameState: GameState;
    events: StoryPlayerEvents;
}
export interface StoryPlayerOptions {
    skipGameCallouts: boolean;
    clearPreviousNodes: boolean;
}
export declare class StoryPlayer {
    private readonly dependencies;
    readonly options: StoryPlayerOptions;
    private readonly _current;
    private _player_state;
    constructor(dependencies: StoryPlayerDependencies, options: StoryPlayerOptions);
    on<Event extends keyof StoryPlayerEvents>(event: Event, handler: StoryPlayerEvents[Event]): void;
    loadScene(sceneId: string): Promise<void>;
    next(): void;
    selectOption(optionId: string): void;
    getCurrentNode(): SceneNode | null;
    getCurrentSceneId(): string | null;
    getGameState(): GameState;
    isWaitingForChoice(): boolean;
    private advance;
}
//# sourceMappingURL=story-player.d.ts.map