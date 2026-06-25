import type { SourceLocation } from "./base";
import type { CharacterId, SceneId } from "./id";
import type { SceneNode } from "./node";
export type SceneMetadata = {
    id: SceneId;
    dslVersion: string;
    chapter: number;
    act: number;
    day: number;
    order: number;
    characters: CharacterId[];
};
export type SceneAst = {
    metadata: SceneMetadata;
    nodes: SceneNode[];
    source: SourceLocation;
};
//# sourceMappingURL=scene.d.ts.map