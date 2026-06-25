import type { RuntimeValue } from "./base";
import type { EventId } from "./id";
export type EventArgument = RuntimeValue;
export type Event = {
    id: EventId;
    arguments?: EventArgument[] | undefined;
};
//# sourceMappingURL=event.d.ts.map