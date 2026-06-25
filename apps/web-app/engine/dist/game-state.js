"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const expression_evaluator_1 = require("./expression-evaluator");
class GameState {
    _variables = new Map();
    _listeners = [];
    constructor(initialState = new Map()) {
        this._variables = initialState;
    }
    get variables() {
        return this._variables;
    }
    get(key) {
        return this._variables.get(key);
    }
    set(key, value) {
        const oldValue = this._variables.get(key);
        if (oldValue === value) {
            return;
        }
        this._variables.set(key, value);
        this.notifyChanges([{ variable: key, oldValue, newValue: value }]);
    }
    applyEffects(effects) {
        const changes = [];
        for (const effect of effects) {
            const oldValue = this._variables.get(effect.variable);
            let newValue = oldValue ?? 0;
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
    evaluateCondition(condition) {
        if (!condition) {
            return true;
        }
        const result = new expression_evaluator_1.ExpressionEvaluator({
            gameStateMap: this._variables,
        }).execute(condition);
        return !!result;
    }
    onStateChanged(callback) {
        this._listeners.push(callback);
    }
    notifyChanges(changes) {
        for (const listener of this._listeners) {
            listener(changes);
        }
    }
}
exports.GameState = GameState;
//# sourceMappingURL=game-state.js.map