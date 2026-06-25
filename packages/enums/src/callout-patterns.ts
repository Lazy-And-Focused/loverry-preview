import { TokenType } from "./tokens";

export const TokenPatterns = {
  [TokenType.callout_quote]: "> [!quote]",
  [TokenType.callout_info]: "> [!info]",
  [TokenType.callout_transition]: "> [!transition]",
  [TokenType.callout_system]: "> [!system]",
  [TokenType.callout_background]: "> [!background]",
  [TokenType.callout_character]: "> [!character]",
  [TokenType.callout_effect]: "> [!effect]",
  [TokenType.choice_line]: /^> [🔵🟡🟣] \*\*выбор:\*\*/,
  [TokenType.meta_line]: "> **",
  [TokenType.action_line]: "> _",
  [TokenType.empty_line]: "",
} as const;

export function detectTokenType(line: string): TokenType | null {
  const resolvedLine = line.trim().toLowerCase();
  if (resolvedLine === "") {
    return TokenType.empty_line;
  }

  const entries = Object.entries(TokenPatterns);
  for (const [type, pattern] of entries) {
    if (typeof pattern === "string") {
      if (!resolvedLine.startsWith(pattern)) {
        continue;
      }
      
      return type as TokenType;
    }

    const matched = pattern.test(resolvedLine);
    if (matched) {
      return type as TokenType;
    }
  }
  
  return TokenType.ignored_line;
}