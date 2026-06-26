import { readFile } from "fs/promises";
import { join } from "path";

import { decompressFromBase64 } from "lz-string";
import { SerializedScene } from "@/types/exporter";

export type SerializedScenes = Record<string, SerializedScene>;

export class ScenesLoader {
  public constructor(private readonly path: string) {}

  public execute(id: string): Promise<SerializedScene | null>;
  public execute(id?: undefined): Promise<SerializedScenes | null>;
  public async execute(id?: string) {
    if (id) {
      return this.loadOne(id);
    }

    return this.loadAll();
  }

  private async loadAll(): Promise<SerializedScenes | null> {
    const path = join(this.path, "scenes.json");
    const json = this.readFileAndParseToJson<SerializedScenes>(path);

    return json;
  }

  private async loadOne(id: string): Promise<SerializedScene | null> {
    const path = join(this.path, id);
    const json = this.readFileAndParseToJson<SerializedScene>(path);

    return json;
  }

  private async readFileAndParseToJson<T>(path: string): Promise<T | null> {
    const file = await readFile(path, "utf-8");
    const json = this.parseToJsonWithDecompressing<T>(file);

    return json;
  }

  private parseToJsonWithDecompressing<T>(file: string): T {
    if (file.startsWith("{")) {
      const json = JSON.parse(file) as T;
      return json;
    }

    const decompressed = decompressFromBase64(file);
    const json = JSON.parse(decompressed) as T;
    return json;
  }
}
