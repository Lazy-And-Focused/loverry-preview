import type { SceneNode, ChoiceNode } from "@loverry/ast";
import type {
  RuntimeScene,
  StoryPlayerEvents,
  ChoiceOption,
  PlayerState,
} from "./types";
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

export class StoryPlayer {
  private readonly _current: CurrentData = {
    scene: null,
    sceneId: null,
    nodeIndex: 0,
  };

  private _player_state: PlayerState = "idle";

  public constructor(
    private readonly dependencies: StoryPlayerDependencies,
    public readonly options: StoryPlayerOptions,
  ) {
    this.dependencies.gameState.onStateChanged((changes) => {
      this.dependencies.events.onGameStateChanged?.(changes);
    });
  }

  public on<Event extends keyof StoryPlayerEvents>(
    event: Event,
    handler: StoryPlayerEvents[Event],
  ): void {
    this.dependencies.events[event] = handler;
  }

  public async loadScene(sceneId: string): Promise<void> {
    if (this._current.sceneId === sceneId && this._current.scene) {
      this._current.nodeIndex = 0;
      this._player_state = "idle";
      this.dependencies.events.onSceneChanged?.(sceneId);
      this.advance();
      return;
    }

    this._current.scene = await this.dependencies.sceneLoader.execute(sceneId);
    this._current.sceneId = sceneId;
    this._current.nodeIndex = 0;
    this._player_state = "idle";

    this.dependencies.events.onSceneChanged?.(sceneId);
    this.advance();
  }

  public next(): void {
    if (this._player_state !== "idle") return;
    this.advance();
  }

  public selectOption(optionId: string): void {
    if (this._player_state !== "waiting_for_choice") {
      return;
    }

    const node = this._current.scene?.nodes[this._current.nodeIndex] as
      | ChoiceNode
      | undefined;
    if (!node) {
      return;
    }

    const option = node.options.find((option) => option.id === optionId);
    if (!option) {
      return;
    }

    if (!this.dependencies.gameState.evaluateCondition(option.condition)) {
      return;
    }

    if (option.effects) {
      this.dependencies.gameState.applyEffects(option.effects);
    }

    if (option.events) {
      for (const event of option.events) {
        this.dependencies.events.onEventTriggered?.(
          event.id,
          event.arguments ?? [],
        );
      }
    }

    if (this._current.scene && option.nodes.length) {
      const parentNodes = this._current.scene.nodes;

      const before = parentNodes.slice(0, this._current.nodeIndex);
      const after = parentNodes.slice(this._current.nodeIndex + 1);
      const newNodes = [...before, ...option.nodes, ...after];

      this._current.scene.nodes = newNodes;
      this._current.nodeIndex = this._current.nodeIndex;
    } else {
      this._current.nodeIndex++;
    }

    this._player_state = "idle";
    this.advance();
  }

  public getCurrentNode(): SceneNode | null {
    if (!this._current.scene) {
      return null;
    }

    const index = this._current.nodeIndex - 1;
    if (index < 0 || index >= this._current.scene.nodes.length) {
      return null;
    }

    return this._current.scene.nodes[index]!;
  }

  public getCurrentSceneId(): string | null {
    return this._current.sceneId;
  }

  public getGameState(): GameState {
    return this.dependencies.gameState;
  }

  public isWaitingForChoice(): boolean {
    return this._player_state === "waiting_for_choice";
  }

  private advance(): void {
    if (this._player_state === "waiting_for_choice") {
      return;
    }

    if (!this._current.scene) {
      return;
    }

    while (this._current.nodeIndex < this._current.scene.nodes.length) {
      const node = this._current.scene.nodes[this._current.nodeIndex]!;
      const passesCondition = this.dependencies.gameState.evaluateCondition(
        node.condition,
      );
      if (!passesCondition) {
        this._current.nodeIndex++;
        continue;
      }

      if (node.effects) this.dependencies.gameState.applyEffects(node.effects);
      if (node.events) {
        for (const ev of node.events) {
          this.dependencies.events.onEventTriggered?.(
            ev.id,
            ev.arguments ?? [],
          );
        }
      }

      switch (node.type) {
        case "choice":
          const options: ChoiceOption[] = node.options
            .filter((option) =>
              this.dependencies.gameState.evaluateCondition(option.condition),
            )
            .map((option) => ({
              id: option.id,
              text: option.text,
              condition: option.condition!,
            }));

          if (options.length === 0) {
            this._current.nodeIndex++;
            continue;
          }
          this._player_state = "waiting_for_choice";
          this.dependencies.events.onChoice?.(options);
          return;

        case "transition":
          const targetId = node.target;
          if (node.mode === "jump" || !node.mode) {
            this.loadScene(targetId);
            return;
          } else if (node.mode === "call") {
            console.warn("call mode not implemented");
          } else if (node.mode === "return") {
            console.warn("return mode not implemented");
          }
          this._current.nodeIndex++;
          continue;

        case "background":
        case "character":
        case "effect":
          this.dependencies.events.onNode?.(node);
          this._current.nodeIndex++;
          if (this.options.skipGameCallouts) {
            continue;
          } else {
            return;
          }

        default:
          this.dependencies.events.onNode?.(node);
          this._current.nodeIndex++;
          return;
      }
    }

    this._player_state = "finished";
    this.dependencies.events.onNode?.(null as any);
  }
}
