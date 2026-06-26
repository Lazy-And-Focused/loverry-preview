import type { SerializedScene } from "@/types/exporter";
import { ScenesLoader, type SerializedScenes } from "./scenes.loader";
import type { StateKey } from "@angular/core";
import type { Observable } from "rxjs";

import { Injectable, makeStateKey, TransferState } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, of } from "rxjs";
import { decompressFromBase64 } from "lz-string";

@Injectable({ providedIn: "root" })
export class ScenesService {
  private static readonly SCENES_KEY = makeStateKey<SerializedScenes>("scenes");

  public constructor(
    private readonly transferState: TransferState,
    private readonly http: HttpClient,
  ) {}

  public execute(id: string): Observable<SerializedScene>;
  public execute(id?: undefined): Observable<SerializedScenes>;
  public execute(id?: string) {
    //@ts-expect-error
    const stored = this.getFromState(id);
    if (stored) {
      return stored;
    }

    //@ts-expect-error
    const observable = this.fetch(id);
    return observable;
  }

  private fetch(id: string): Observable<SerializedScene>;
  private fetch(id?: undefined): Observable<SerializedScenes>;
  private fetch(id?: string) {
    if (id) {
      return this.fetchScene(id);
    }

    return this.fetchScenes();
  }

  private fetchScenes(): Observable<SerializedScenes> {
    const json = this.http.get(`/scenes/scenes.json`, { responseType: "text" });
    const scenes = json.pipe(map((data) => {
      if (data.startsWith("{")) {
        const json = JSON.parse(data);
        return json;
      }

      const decompressed = decompressFromBase64(data);
      const json = JSON.parse(decompressed);
      return json;
    }));

    return scenes;
  }

  private fetchScene(id: string): Observable<SerializedScene> {
    throw new Error("method not realized.");
    const scene = this.http.get<SerializedScene>(`/api/scenes/${id}`);
    return scene;
  }

  private getFromState(
    id: string,
  ): Observable<NonNullable<SerializedScene>> | null;
  private getFromState(
    id?: undefined,
  ): Observable<NonNullable<SerializedScenes>> | null;
  private getFromState(id?: string) {
    //@ts-expect-error
    const key = this.makeStateKey(id);
    const data = this.getDataFromState<SerializedScene | SerializedScenes>(key);
    return data;
  }

  private getDataFromState<T>(
    key: StateKey<T>,
    defaultValue: T | null = null,
  ): Observable<NonNullable<T>> | null {
    const stored = this.transferState.get(key, defaultValue);
    if (stored) {
      this.transferState.remove(key);
      return of(stored);
    }

    return null;
  }

  private makeStateKey(id: string): StateKey<SerializedScene>;
  private makeStateKey(id?: undefined): StateKey<SerializedScenes>;
  private makeStateKey(id?: string) {
    if (id) {
      return makeStateKey<SerializedScene>(`scenes_${id}`);
    }

    return ScenesService.SCENES_KEY;
  }
}
