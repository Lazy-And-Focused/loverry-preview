import type { VariableId } from "./id";
import type { ExpressionOperator } from "./operators";
import type {
  Prettify,
  RuntimeValue,
  SourceLocation,
} from "./base";

export type BaseExpression = {
  source?: SourceLocation | undefined;
};

export type LiteralExpression = Prettify<
  BaseExpression & {
    type: "literal";
    value: RuntimeValue;
  }
>;

export type VariableReferenceExpression = Prettify<
  BaseExpression & {
    type: "variable_reference";
    variable: VariableId;
  }
>;

export type BinaryExpression = Prettify<
  BaseExpression & {
    type: "binary";
    operator: ExpressionOperator;
    left: Expression;
    right: Expression;
  }
>;

export type UnaryExpression = Prettify<
  BaseExpression & {
    type: "unary";
    operator: "not";
    operand: Expression;
  }
>;

export type Expression =
  | LiteralExpression
  | VariableReferenceExpression
  | BinaryExpression
  | UnaryExpression;
