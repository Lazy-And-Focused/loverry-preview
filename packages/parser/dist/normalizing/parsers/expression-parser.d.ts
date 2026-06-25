import type { Effect, Expression, RuntimeValue, SourceLocation, Event } from "@loverry/ast";
import { ErrorsCollector } from "../errors-collectror";
import { RegistriesCollector } from "../registries-collector";
export interface ExpressionParserDependencies {
    readonly errors: ErrorsCollector;
    readonly registries: RegistriesCollector;
}
export declare class ExpressionParser {
    private readonly dependencies;
    constructor(dependencies: ExpressionParserDependencies);
    parseCondition({ source, condition, }: {
        condition?: string;
        source: SourceLocation;
    }): Expression | undefined;
    parseEffect(raw: string, source: SourceLocation): Effect | null;
    parseEventArgument(argument: string): RuntimeValue;
    parseEvent({ source, event, }: {
        event?: string;
        source: SourceLocation;
    }): Event | undefined;
}
//# sourceMappingURL=expression-parser.d.ts.map