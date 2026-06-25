import type { RuntimeValue, SourceLocation } from "./base";
import type { VariableId } from "./id";
import type { EffectOperator } from "./operators";
export type Effect = {
    variable: VariableId;
    operator: EffectOperator;
    value: RuntimeValue;
    source?: SourceLocation | undefined;
};
//# sourceMappingURL=effect.d.ts.map