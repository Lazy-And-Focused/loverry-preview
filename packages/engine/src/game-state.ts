import type { Effect, Expression } from "@loverry/ast";
import { ExpressionEvaluator } from "./expression-evaluator";
import { GameStateChange, GameStateMap, GameStateValue } from "./types";

export class GameState {
  private readonly _variables: GameStateMap = new Map();
  private readonly _listeners: ((changes: GameStateChange[]) => void)[] = [];

  public constructor(initialState: GameStateMap = new Map()) {
    this._variables = initialState;
  }

  public get variables() {
    return this._variables;
  }

  public get(key: string): GameStateValue | undefined {
    return this._variables.get(key);
  }

  public set(key: string, value: GameStateValue): void {
    const oldValue = this._variables.get(key);
    if (oldValue === value) {
      return;
    }

    this._variables.set(key, value);
    this.notifyChanges([{ variable: key, oldValue, newValue: value }]);
  }

  public applyEffects(effects: Effect[]): void {
    const changes: GameStateChange[] = [];

    for (const effect of effects) {
      const oldValue = this._variables.get(effect.variable);
      let newValue: GameStateValue = oldValue ?? 0;
      const rhs = effect.value;

      switch (effect.operator) {
        case "=":
          newValue = rhs;
          break;
        case "+=":
          newValue = (Number(oldValue) || 0) + Number(rhs);
          break;
        case "-=":
          newValue = (Number(oldValue) || 0) - Number(rhs);
          break;
      }

      if (newValue !== oldValue) {
        this._variables.set(effect.variable, newValue);
        changes.push({ variable: effect.variable, oldValue, newValue });
      }
    }

    if (changes.length) {
      this.notifyChanges(changes);
    }
  }

  public evaluateCondition(condition?: Expression): boolean {
    if (!condition) {
      return true;
    }

    const result = new ExpressionEvaluator({
      gameStateMap: this._variables,
    }).execute(condition);

    return !!result;
  }

  public onStateChanged(callback: (changes: GameStateChange[]) => void): void {
    this._listeners.push(callback);
  }

  private notifyChanges(changes: GameStateChange[]): void {
    for (const listener of this._listeners) {
      listener(changes);
    }
  }
}
