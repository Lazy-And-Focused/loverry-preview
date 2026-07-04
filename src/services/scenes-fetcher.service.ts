import { SerializedScenes } from "@/services/scenes.loader";
import { SerializedScene } from "@/types/exporter";
import { maybeDecompressAndParseJson } from "@/utils/decompress-json";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ScenesFetcher {
  public constructor(
    public readonly http: HttpClient
  ) {}

  public execute(id: string): Observable<SerializedScene>;
  public execute(id?: undefined): Observable<SerializedScenes>;
  public execute(id?: string) {
    if (id) {
      return this.fetchScene(id);
    }

    return this.fetchScenes();
  }

  public getAllScenesId(): Observable<string[]> {
    return this.getJson(`/scenes/array.json`);
  }

  public getGroupedScenes(id: string): Observable<string[]> {
    return this.getJson(`/scenes/${id}.json`);
  }

  private fetchScenes() {
    return this.getJson("/scenes/scenes.json");
  }

  private fetchScene(id: string) {
    return this.getJson(`/scenes/${id}.json`);
  }

  private getJson<T = unknown>(route: string) {
    const data = this.http.get(route, { responseType: "text" });
    const json = maybeDecompressAndParseJson<T>(data);
    return json;
  }
}