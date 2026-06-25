import type { SourceLocation } from "@loverry/ast";

export class IdGenerator {
  private _scene_id: string | null;

  public static simpleHash(string: string): string {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash * 33) ^ string.charCodeAt(i);
    }

    return Math.abs(hash).toString(36);
  }

  public constructor(sceneId: string | null) {
    this._scene_id = sceneId;
  }

  public setSceneId(id: string | null): this {
    this._scene_id = id;
    return this;
  }

  public execute(
    type: string,
    source: SourceLocation,
    extra: string = "",
  ): string {
    const data = `${this._scene_id || ""}${type}:${source.line}:${source.column}:${extra}`;
    return `node_${IdGenerator.simpleHash(data)}`;
  }
}
