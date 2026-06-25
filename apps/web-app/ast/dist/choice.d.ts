import type { Expression } from "./expressions";
import type { NodeId } from "./id";
import type { SceneNode } from "./node";
import type { Effect } from "./effect";
import type { Event } from "./event";
export type ChoiceOption = {
    id: NodeId;
    text: string;
    condition?: Expression | undefined;
    effects?: Effect[] | undefined;
    events?: Event[] | undefined;
    nodes: SceneNode[];
};
//# sourceMappingURL=choice.d.ts.map