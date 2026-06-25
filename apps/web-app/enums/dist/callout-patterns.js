"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPatterns = void 0;
exports.detectTokenType = detectTokenType;
const tokens_1 = require("./tokens");
exports.TokenPatterns = {
    [tokens_1.TokenType.callout_quote]: "> [!quote]",
    [tokens_1.TokenType.callout_info]: "> [!info]",
    [tokens_1.TokenType.callout_transition]: "> [!transition]",
    [tokens_1.TokenType.callout_system]: "> [!system]",
    [tokens_1.TokenType.callout_background]: "> [!background]",
    [tokens_1.TokenType.callout_character]: "> [!character]",
    [tokens_1.TokenType.callout_effect]: "> [!effect]",
    [tokens_1.TokenType.choice_line]: /^> [🔵🟡🟣] \*\*выбор:\*\*/,
    [tokens_1.TokenType.meta_line]: "> **",
    [tokens_1.TokenType.action_line]: "> _",
    [tokens_1.TokenType.empty_line]: "",
};
function detectTokenType(line) {
    const resolvedLine = line.trim().toLowerCase();
    if (resolvedLine === "") {
        return tokens_1.TokenType.empty_line;
    }
    const entries = Object.entries(exports.TokenPatterns);
    for (const [type, pattern] of entries) {
        if (typeof pattern === "string") {
            if (!resolvedLine.startsWith(pattern)) {
                continue;
            }
            return type;
        }
        const matched = pattern.test(resolvedLine);
        if (matched) {
            return type;
        }
    }
    return tokens_1.TokenType.ignored_line;
}
//# sourceMappingURL=callout-patterns.js.map