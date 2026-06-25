export declare const DEFAULT_SPEAK_FORMAT = "real";
export declare const SPEAK_FORMATS: readonly ["real", "text", "voice"];
export type SpeakFormat = (typeof SPEAK_FORMATS)[number];
export declare const SYSTEM_SEVERITIES: readonly ["info", "warning", "error"];
export type SystemSeverity = (typeof SYSTEM_SEVERITIES)[number];
export declare const TRANSITION_MODES: readonly ["jump", "call", "return"];
export type TransitionMode = (typeof TRANSITION_MODES)[number];
export type BackgroundTransition = string;
export type RuntimeValue = number | boolean | string;
export type SourceLocation = {
    file: string;
    line: number;
    column: number;
};
export type Prettify<T> = {
    [P in keyof T]: T[P];
} & {};
//# sourceMappingURL=base.d.ts.map