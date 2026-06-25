import type { RuntimeScene } from "./types";

import { decompressFromBase64 } from "lz-string";

export interface SceneLoader {
  execute(sceneId: string): Promise<RuntimeScene>;
}

export class JsonSceneLoader implements SceneLoader {
  private readonly _cache: Map<string, RuntimeScene> = new Map();
  private readonly _base_url: string;

  public constructor(baseUrl: string = "/scenes") {
    this._base_url = baseUrl;
  }

  async execute(sceneId: string): Promise<RuntimeScene> {
    if (this._cache.has(sceneId)) {
      return this._cache.get(sceneId)!;
    }

    const url = `${this._base_url}/${sceneId}.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load scene ${sceneId}: ${response.status}`);
    }

    const scene = (await response.json()) as RuntimeScene;
    this._cache.set(sceneId, scene);
    return structuredClone(scene);
  }
}

export class SingleJsonSceneLoader implements SceneLoader {
  private readonly _url: string;
  private _scenes_map: Record<string, RuntimeScene> | null = null;

  public constructor(url: string = "/scenes/scenes.json") {
    this._url = url;
  }

  public async execute(sceneId: string): Promise<RuntimeScene> {
    await this.ensureLoaded();
    const scene = this._scenes_map![sceneId];
    if (!scene) {
      throw new Error(`Scene ${sceneId} not found`);
    }

    return structuredClone(scene);
  }

  public async ensureLoaded(): Promise<Record<string, RuntimeScene>> {
    if (this._scenes_map) {
      return this._scenes_map;
    }

    const response = await fetch(this._url);
    if (!response.ok) {
      throw new Error(`Failed to load scenes.json`);
    }

    const text = (await response.text()) as string;
    const scenes = (() => {
      if (text.startsWith("{")) {
        return JSON.parse(text) as Record<string, RuntimeScene>;
      }

      const json = decompressFromBase64(text);
      return JSON.parse(json) as Record<string, RuntimeScene>;
    })();

    this._scenes_map = scenes;

    return structuredClone(scenes) as Record<string, RuntimeScene>;
  }
}
