import type { Expression, RuntimeValue } from "@loverry/ast";
import type { GameStateMap } from "./types";
export type GetExpression<Type extends Expression["type"]> = Extract<Expression, {
    type: Type;
}>;
type ExpressionEvaluatorParserType = {
    [Key in Expression["type"]]: (expression: GetExpression<Key>) => unknown;
};
export interface ExpressionEvaluatorDependencies {
    readonly gameStateMap: GameStateMap;
}
export declare class ExpressionEvaluator implements ExpressionEvaluatorParserType {
    private readonly dependencies;
    private static readonly BINARY_OPERATORS;
    private static readonly UNARY_OPERATOR;
    constructor(dependencies: ExpressionEvaluatorDependencies);
    execute(expression: Expression): RuntimeValue;
    literal(expression: Expression): RuntimeValue;
    variable_reference(expression: Expression): RuntimeValue;
    binary(expression: Expression): boolean;
    unary(expression: Expression): RuntimeValue;
    parseCondition(condition: string): Expression | null;
    private resolveExpression;
}
export {};
//# sourceMappingURL=expression-evaluator.d.ts.map