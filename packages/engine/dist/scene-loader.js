"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleJsonSceneLoader = exports.JsonSceneLoader = void 0;
const lz_string_1 = require("lz-string");
class JsonSceneLoader {
    _cache = new Map();
    _base_url;
    constructor(baseUrl = "/scenes") {
        this._base_url = baseUrl;
    }
    async execute(sceneId) {
        if (this._cache.has(sceneId)) {
            return this._cache.get(sceneId);
        }
        const url = `${this._base_url}/${sceneId}.json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load scene ${sceneId}: ${response.status}`);
        }
        const scene = (await response.json());
        this._cache.set(sceneId, scene);
        return structuredClone(scene);
    }
}
exports.JsonSceneLoader = JsonSceneLoader;
class SingleJsonSceneLoader {
    _url;
    _scenes_map = null;
    constructor(url = "/scenes/scenes.json") {
        this._url = url;
    }
    async execute(sceneId) {
        await this.ensureLoaded();
        const scene = this._scenes_map[sceneId];
        if (!scene) {
            throw new Error(`Scene ${sceneId} not found`);
        }
        return structuredClone(scene);
    }
    async ensureLoaded() {
        if (this._scenes_map) {
            return this._scenes_map;
        }
        const response = await fetch(this._url);
        if (!response.ok) {
            throw new Error(`Failed to load scenes.json`);
        }
        const text = (await response.text());
        const scenes = (() => {
            if (text.startsWith("{")) {
                return JSON.parse(text);
            }
            const json = (0, lz_string_1.decompressFromBase64)(text);
            return JSON.parse(json);
        })();
        this._scenes_map = scenes;
        return structuredClone(scenes);
    }
}
exports.SingleJsonSceneLoader = SingleJsonSceneLoader;
//# sourceMappingURL=scene-loader.js.map