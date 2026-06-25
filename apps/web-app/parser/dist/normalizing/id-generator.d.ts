import type { SourceLocation } from "@loverry/ast";
export declare class IdGenerator {
    private _scene_id;
    static simpleHash(string: string): string;
    constructor(sceneId: string | null);
    setSceneId(id: string | null): this;
    execute(type: string, source: SourceLocation, extra?: string): string;
}
//# sourceMappingURL=id-generator.d.ts.map