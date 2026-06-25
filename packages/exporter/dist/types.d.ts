import type { CharacterId, EmotionId, SceneId, NodeId, VariableId, RuntimeValue, BackgroundTransition, CharacterEmotionId, EffectId, EffectOperator, SystemSeverity, TransitionMode } from "@loverry/ast";
export type SerializedLiteral = {
    type: "literal";
    value: RuntimeValue;
};
export type SerializedVariableReference = {
    type: "variable_reference";
    variable: VariableId;
};
export type SerializedBinary = {
    type: "binary";
    operator: "==" | "!=" | ">=" | "<=" | ">" | "<" | "and" | "or";
    left: SerializedExpression;
    right: SerializedExpression;
};
export type SerializedUnary = {
    type: "unary";
    operator: "not";
    operand: SerializedExpression;
};
export type SerializedExpression = SerializedLiteral | SerializedVariableReference | SerializedBinary | SerializedUnary;
export type SerializedEffect = {
    variable: VariableId;
    operator: EffectOperator;
    value: RuntimeValue;
};
export type SerializedEvent = {
    id: string;
    arguments: RuntimeValue[] | null;
};
type SerializedBaseNode = {
    id: NodeId;
    type: string;
    action: string | null;
    condition: SerializedExpression | null;
    effects: SerializedEffect[] | null;
    events: SerializedEvent[] | null;
};
export type SerializedActionNode = SerializedBaseNode & {
    type: "action";
    text: string;
};
export type SerializedDialogueNode = SerializedBaseNode & {
    type: "dialogue";
    character: CharacterId;
    emotion: EmotionId | null;
    text: string;
};
export type SerializedThoughtNode = SerializedBaseNode & {
    type: "thought";
    character: CharacterId;
    text: string;
};
export type SerializedSystemNode = SerializedBaseNode & {
    type: "system";
    text: string;
    severity: SystemSeverity | null;
};
export type SerializedTransitionNode = SerializedBaseNode & {
    type: "transition";
    target: SceneId;
    mode: TransitionMode | null;
};
export type SerializedChoiceOption = {
    id: NodeId;
    text: string;
    condition: SerializedExpression | null;
    effects: SerializedEffect[] | null;
    events: SerializedEvent[] | null;
    nodes: SerializedSceneNode[];
};
export type SerializedChoiceNode = SerializedBaseNode & {
    type: "choice";
    options: SerializedChoiceOption[];
};
export type SerializedBackgroundNode = SerializedBaseNode & {
    type: "background";
    file: string;
    transition?: BackgroundTransition | undefined;
    animation?: string | undefined;
};
export type SerializedCharacterNode = SerializedBaseNode & {
    type: "character";
    character: CharacterId;
    emotion?: CharacterEmotionId | undefined;
    sprite?: string | undefined;
    position?: string | number | undefined;
    animation?: string | undefined;
    zIndex?: number | undefined;
    hidden?: boolean | undefined;
};
export type SerializedEffectNode = SerializedBaseNode & {
    type: "effect";
    effect?: EffectId | undefined;
    intensity?: number | undefined;
    duration?: number | undefined;
};
export type SerializedSceneNode = SerializedActionNode | SerializedDialogueNode | SerializedThoughtNode | SerializedSystemNode | SerializedTransitionNode | SerializedChoiceNode | SerializedBackgroundNode | SerializedCharacterNode | SerializedEffectNode;
export type SerializedScene = {
    metadata: {
        id: SceneId;
        dslVersion: string;
        chapter?: number | undefined;
        act?: number | undefined;
        day?: number | undefined;
        characters?: CharacterId[] | undefined;
    };
    nodes: SerializedSceneNode[];
};
export {};
//# sourceMappingURL=types.d.ts.map