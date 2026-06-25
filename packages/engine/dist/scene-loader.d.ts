import type { RuntimeScene } from "./types";
export interface SceneLoader {
    execute(sceneId: string): Promise<RuntimeScene>;
}
export declare class JsonSceneLoader implements SceneLoader {
    private readonly _cache;
    private readonly _base_url;
    constructor(baseUrl?: string);
    execute(sceneId: string): Promise<RuntimeScene>;
}
export declare class SingleJsonSceneLoader implements SceneLoader {
    private readonly _url;
    private _scenes_map;
    constructor(url?: string);
    execute(sceneId: string): Promise<RuntimeScene>;
    ensureLoaded(): Promise<Record<string, RuntimeScene>>;
}
//# sourceMappingURL=scene-loader.d.ts.map