"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdGenerator = void 0;
class IdGenerator {
    _scene_id;
    static simpleHash(string) {
        let hash = 5381;
        for (let i = 0; i < string.length; i++) {
            hash = (hash * 33) ^ string.charCodeAt(i);
        }
        return Math.abs(hash).toString(36);
    }
    constructor(sceneId) {
        this._scene_id = sceneId;
    }
    setSceneId(id) {
        this._scene_id = id;
        return this;
    }
    execute(type, source, extra = "") {
        const data = `${this._scene_id || ""}${type}:${source.line}:${source.column}:${extra}`;
        return `node_${IdGenerator.simpleHash(data)}`;
    }
}
exports.IdGenerator = IdGenerator;
//# sourceMappingURL=id-generator.js.map