import type {
  Effect,
  EventId,
  Expression,
  RuntimeValue,
  SourceLocation,
  VariableId,
  Event,
} from "@loverry/ast";
import { Parser } from "@loverry/expressions";

import { ErrorsCollector } from "../errors-collectror";
import { RegistriesCollector } from "../registries-collector";

export interface ExpressionParserDependencies {
  readonly errors: ErrorsCollector;
  readonly registries: RegistriesCollector;
}

export class ExpressionParser {
  public constructor(
    private readonly dependencies: ExpressionParserDependencies,
  ) {}

  public parseCondition({
    source,
    condition,
  }: {
    condition?: string;
    source: SourceLocation;
  }): Expression | undefined {
    if (!condition) {
      return undefined;
    }

    try {
      const expression = Parser.execute(condition);
      return expression;
    } catch (err) {
      this.dependencies.errors.add(
        `Failed to parse condition "${condition}": ${err}`,
        source,
      );

      return undefined;
    }
  }

  public parseEffect(raw: string, source: SourceLocation): Effect | null {
    const match = raw.match(/^(\w+)\s*([+\-]?=)\s*(.+)$/);
    if (!match) {
      this.dependencies.errors.add(`Invalid effect syntax: "${raw}"`, source);
      return null;
    }

    const variable = match[1]!;
    let operator = match[2] as "=" | "+=" | "-=";
    const valueString = match[3]!.trim();

    if (!this.dependencies.registries.variables[variable]) {
      this.dependencies.errors.add(`Unknown variable "${variable}"`, source);
      return null;
    }

    let value: RuntimeValue;
    if (/^-?\d+(\.\d+)?$/.test(valueString)) {
      value = parseFloat(valueString);
    } else if (valueString === "true") {
      value = true;
    } else if (valueString === "false") {
      value = false;
    } else {
      value = valueString;
    }

    return { variable: variable as VariableId, operator, value, source };
  }

  public parseEventArgument(argument: string): RuntimeValue {
    if (/^-?\d+(\.\d+)?$/.test(argument)) {
      return parseFloat(argument);
    }

    if (argument === "true") {
      return true;
    }

    if (argument === "false") {
      return false;
    }

    return argument;
  }

  public parseEvent({
    source,
    event,
  }: {
    event?: string;
    source: SourceLocation;
  }): Event | undefined {
    if (!event) {
      return undefined;
    }

    const parts = event.trim().split(/\s+/);
    const id = parts[0]!;
    if (!this.dependencies.registries.events[id]) {
      this.dependencies.errors.add(`Unknown event "${id}"`, source);
      return undefined;
    }

    const args = parts.slice(1).map((a) => this.parseEventArgument(a));
    return {
      id: id as EventId,
      arguments: args,
    };
  }
}
