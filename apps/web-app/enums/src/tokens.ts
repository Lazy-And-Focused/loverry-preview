import { Enumeration } from "@loverry/utils";

const TokenTypeDefenition = {
  callout_quote: "callout_quote",
  callout_info: "callout_info",
  callout_transition: "callout_transition",
  callout_system: "callout_system",
  callout_background: "callout_background",
  callout_character: "callout_character",
  callout_effect: "callout_effect",
  meta_line: "meta_line",
  action_line: "action_line",
  choice_line: "choice_line",
  empty_line: "empty_line",
  ignored_line: "ignored_line",
  eof: "eof",
} as const;

export const TokenTypeEnum = new Enumeration(TokenTypeDefenition);
export const TokenType = TokenTypeEnum.enumeration;
export type TokenType = typeof TokenTypeEnum.type;

export type Token = {
  type: TokenType;
  lowerValue: string;
  value: string;
  line: number;
  column: number;
};
