import type {
  BinaryExpression,
  Expression,
  RuntimeValue,
  UnaryExpression,
} from "@loverry/ast";
import type { GameStateMap } from "./types";

import { Parser } from "@loverry/expressions";

export type GetExpression<Type extends Expression["type"]> = Extract<
  Expression,
  { type: Type }
>;

type ExpressionEvaluatorParserType = {
  [Key in Expression["type"]]: (expression: GetExpression<Key>) => unknown;
};

export interface ExpressionEvaluatorDependencies {
  readonly gameStateMap: GameStateMap;
}

export class ExpressionEvaluator implements ExpressionEvaluatorParserType {
  private static readonly BINARY_OPERATORS: Record<
    BinaryExpression["operator"],
    (left: RuntimeValue, right: RuntimeValue) => boolean
  > = {
    "==": (l, r) => l === r,
    "!=": (l, r) => l !== r,
    ">": (l, r) => l > r,
    "<": (l, r) => l < r,
    ">=": (l, r) => l >= r,
    "<=": (l, r) => l <= r,
    and: (l, r) => !!l && !!r,
    or: (l, r) => !!l || !!r,
  };

  private static readonly UNARY_OPERATOR: Record<
    UnaryExpression["operator"],
    (thisArgument: ExpressionEvaluator, operand: Expression) => RuntimeValue
  > = {
    not: (thisArgument, operand) => !thisArgument.execute(operand),
  };

  public constructor(
    private readonly dependencies: ExpressionEvaluatorDependencies,
  ) {}

  public execute(expression: Expression): RuntimeValue {
    return this[expression.type](expression);
  }

  public literal(expression: Expression): RuntimeValue {
    const literalExpression = this.resolveExpression({
      expression,
      type: "literal",
    });
    return literalExpression.value;
  }

  public variable_reference(expression: Expression): RuntimeValue {
    const variableReferenceExpression = this.resolveExpression({
      expression,
      type: "variable_reference",
    });
    const value = this.dependencies.gameStateMap.get(
      variableReferenceExpression.variable,
    );
    if (!value) {
      return false;
    }

    return value;
  }

  public binary(expression: Expression): boolean {
    const binaryExpression = this.resolveExpression({
      expression,
      type: "binary",
    });
    const left = this.execute(binaryExpression.left);
    const right = this.execute(binaryExpression.right);

    return ExpressionEvaluator.BINARY_OPERATORS[binaryExpression.operator](
      left,
      right,
    );
  }

  public unary(expression: Expression): RuntimeValue {
    const unaryExpression = this.resolveExpression({
      expression,
      type: "unary",
    });
    return ExpressionEvaluator.UNARY_OPERATOR[unaryExpression.operator](
      this,
      unaryExpression.operand,
    );
  }

  public parseCondition(condition: string): Expression | null {
    try {
      return Parser.execute(condition);
    } catch {
      return null;
    }
  }

  private resolveExpression<T extends Expression["type"]>(options: {
    type: T;
    expression: Expression;
  }): GetExpression<T> {
    if (options.expression.type !== options.type) {
      throw new Error(
        `incompatibility of expressions type, expected ${options.type}, recieved ${options.expression.type}`,
      );
    }

    return options.expression as GetExpression<T>;
  }
}
