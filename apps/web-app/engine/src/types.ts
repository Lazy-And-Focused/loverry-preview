import type { SceneNode, SceneAst, Expression } from "@loverry/ast";

export type RuntimeScene = {
  metadata: SceneAst["metadata"];
  nodes: SceneNode[];
};

export type GameStateValue = number | boolean | string;
export type GameStateMap = Map<string, GameStateValue>;

export interface GameStateChange {
  variable: string;
  oldValue?: GameStateValue | undefined;
  newValue: GameStateValue;
}

export interface StoryPlayerEvents {
  onSceneChanged: (sceneId: string) => void;
  onNode: (node: SceneNode) => void;
  onChoice: (options: ChoiceOption[]) => void;
  onTransition: (targetSceneId: string) => void;
  onGameStateChanged: (changes: GameStateChange[]) => void;
  onEventTriggered: (eventId: string, args: any[]) => void;
}

export interface ChoiceOption {
  id: string;
  text: string;
  condition?: Expression;
}

export type PlayerState = "idle" | "waiting_for_choice" | "finished";
