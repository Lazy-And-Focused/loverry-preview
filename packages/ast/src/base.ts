export const DEFAULT_SPEAK_FORMAT = "real";
export const SPEAK_FORMATS = [
  "real",
  "text",
  "voice"
] as const;

export type SpeakFormat = (typeof SPEAK_FORMATS)[number];

export const SYSTEM_SEVERITIES = [
  "info", "warning", "error"
] as const;

export type SystemSeverity = (typeof SYSTEM_SEVERITIES)[number];

export const TRANSITION_MODES = [
  "jump", "call", "return"
] as const;

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
