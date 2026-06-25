import { Enumeration } from "@loverry/utils";
export declare const TokenTypeEnum: Enumeration<{
    readonly callout_quote: "callout_quote";
    readonly callout_info: "callout_info";
    readonly callout_transition: "callout_transition";
    readonly callout_system: "callout_system";
    readonly callout_background: "callout_background";
    readonly callout_character: "callout_character";
    readonly callout_effect: "callout_effect";
    readonly meta_line: "meta_line";
    readonly action_line: "action_line";
    readonly choice_line: "choice_line";
    readonly empty_line: "empty_line";
    readonly ignored_line: "ignored_line";
    readonly eof: "eof";
}>;
export declare const TokenType: {
    readonly callout_quote: "callout_quote";
    readonly callout_info: "callout_info";
    readonly callout_transition: "callout_transition";
    readonly callout_system: "callout_system";
    readonly callout_background: "callout_background";
    readonly callout_character: "callout_character";
    readonly callout_effect: "callout_effect";
    readonly meta_line: "meta_line";
    readonly action_line: "action_line";
    readonly choice_line: "choice_line";
    readonly empty_line: "empty_line";
    readonly ignored_line: "ignored_line";
    readonly eof: "eof";
};
export type TokenType = typeof TokenTypeEnum.type;
export type Token = {
    type: TokenType;
    lowerValue: string;
    value: string;
    line: number;
    column: number;
};
//# sourceMappingURL=tokens.d.ts.map