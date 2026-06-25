import type { SceneAst } from "@loverry/ast";
import type { SerializedScene } from "./types";
export * from "./types";
export declare class SceneExporter {
    execute(scene: SceneAst): SerializedScene;
    exportToJson(scene: SceneAst): string;
    private serializeScene;
    private serializeNode;
    private serializeChoiceOption;
    private serializeExpression;
    private serializeEffect;
    private serializeEvent;
}
//# sourceMappingURL=index.d.ts.map