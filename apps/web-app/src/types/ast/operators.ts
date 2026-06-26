export const EXPRESSION_OPERATORS = [
  "==", "!=", ">=", "<=", ">", "<", "and", "or"
] as const;

export type ExpressionOperator = (typeof EXPRESSION_OPERATORS)[number];

export const EFFECT_OPERATORS = [
  "=", "+=", "-="
];

export type EffectOperator = (typeof EFFECT_OPERATORS)[number];
