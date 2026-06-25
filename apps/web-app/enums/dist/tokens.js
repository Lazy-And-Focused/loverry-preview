"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = exports.TokenTypeEnum = void 0;
const utils_1 = require("@loverry/utils");
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
};
exports.TokenTypeEnum = new utils_1.Enumeration(TokenTypeDefenition);
exports.TokenType = exports.TokenTypeEnum.enumeration;
//# sourceMappingURL=tokens.js.map