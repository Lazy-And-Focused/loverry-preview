import type { Expression } from "./expressions";
import type { Effect } from "./effect";
import type { ChoiceOption } from "./choice";
import type { Event } from "./event";
import type {
  BackgroundTransition,
  Prettify,
  SourceLocation,
  SpeakFormat,
  SystemSeverity,
  TransitionMode,
} from "./base";

import type { CharacterEmotionId, CharacterId, EffectId, EmotionId, NodeId, SceneId } from "./id";

export type BaseNode = {
  id: NodeId;

  source: SourceLocation;

  action?: string | undefined;
  condition?: Expression | undefined;
  effects?: Effect[] | undefined;
  events?: Event[] | undefined;
};

export type ActionNode = Prettify<
  BaseNode & {
    type: "action";
    text: string;
  }
>;

export type DialogueNode = Prettify<
  BaseNode & {
    type: "dialogue";
    character: CharacterId;
    emotion?: EmotionId | undefined;
    format?: SpeakFormat | undefined;
    text: string;
  }
>;

export type ThoughtNode = Prettify<
  BaseNode & {
    type: "thought";
    character: CharacterId;
    text: string;
  }
>;

export type SystemNode = Prettify<
  BaseNode & {
    type: "system";
    text: string;
    severity?: SystemSeverity | undefined;
  }
>;

export type TransitionNode = Prettify<
  BaseNode & {
    type: "transition";
    target: SceneId;
    mode?: TransitionMode | undefined;
  }
>;

export type ChoiceNode = Prettify<
  BaseNode & {
    type: "choice";
    options: ChoiceOption[];
  }
>;

export type BackgroundNode = Prettify<
  BaseNode & {
    type: "background";
    file: string;
    transition?: BackgroundTransition | undefined;
    animation?: string | undefined;
  }
>;

export type CharacterNode = Prettify<
  BaseNode & {
    type: "character";

    character: CharacterId;
    emotion?: CharacterEmotionId | undefined;
    sprite?: string | undefined;

    position?: string | number | undefined;
    animation?: string | undefined;
    zIndex?: number | undefined;
    hidden?: boolean | undefined;
  }
>;

export type EffectNode = Prettify<
  BaseNode & {
    type: "effect";
    effect?: EffectId | undefined;
    intensity?: number | undefined;
    /** Миллисекунды */
    duration?: number | undefined;
  }
>;

export type GameNode = Prettify<BackgroundNode | CharacterNode | EffectNode>;

export type SceneNode =
  | ActionNode
  | DialogueNode
  | ThoughtNode
  | SystemNode
  | ChoiceNode
  | TransitionNode
  | GameNode;

export type GetSceneNode<Type extends SceneNode["type"]> = Extract<
  SceneNode,
  { type: Type }
>;
