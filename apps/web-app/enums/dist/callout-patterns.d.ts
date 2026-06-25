import { TokenType } from "./tokens";
export declare const TokenPatterns: {
    readonly callout_quote: "> [!quote]";
    readonly callout_info: "> [!info]";
    readonly callout_transition: "> [!transition]";
    readonly callout_system: "> [!system]";
    readonly callout_background: "> [!background]";
    readonly callout_character: "> [!character]";
    readonly callout_effect: "> [!effect]";
    readonly choice_line: RegExp;
    readonly meta_line: "> **";
    readonly action_line: "> _";
    readonly empty_line: "";
};
export declare function detectTokenType(line: string): TokenType | null;
//# sourceMappingURL=callout-patterns.d.ts.map