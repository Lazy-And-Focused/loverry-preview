import type { Prettify, SourceLocation } from "./base";
export type RawBaseNode = {
    source: SourceLocation;
    rawAction?: string | undefined;
    rawConditions?: string | undefined;
    rawEffects?: string[] | undefined;
    rawEvents?: string[] | undefined;
};
export type RawDialogueNode = Prettify<RawBaseNode & {
    type: "dialogue";
    rawSpeaker: string;
    rawFormat?: string | undefined;
    rawEmotion?: string | undefined;
    rawText: string;
}>;
export type RawThoughtNode = Prettify<RawBaseNode & {
    type: "thought";
    rawSpeaker: string;
    rawText: string;
}>;
export type RawActionNode = Prettify<RawBaseNode & {
    type: "action";
    rawText: string;
}>;
export type RawSystemNode = Prettify<RawBaseNode & {
    type: "system";
    rawText: string;
    rawSeverity?: "info" | "warning" | "error" | undefined;
}>;
export type RawChoiceOption = {
    id?: string | undefined;
    rawText: string;
    rawConditions?: string | undefined;
    rawEffects?: string[] | undefined;
    rawEvents?: string[] | undefined;
    nodes: RawSceneNode[];
};
export type RawChoiceNode = Prettify<RawBaseNode & {
    type: "choice";
    options: RawChoiceOption[];
}>;
export type RawTransitionNode = Prettify<RawBaseNode & {
    type: "transition";
    rawTarget: string;
    rawMode?: "jump" | "call" | "return" | undefined;
}>;
export type RawSceneNode = RawDialogueNode | RawThoughtNode | RawActionNode | RawSystemNode | RawChoiceNode | RawTransitionNode;
export type RawScene = {
    source: SourceLocation;
    nodes: RawSceneNode[];
};
//# sourceMappingURL=raw.d.ts.map