import type { SerializedScene } from "@/types/exporter";
import type { SerializedScenes } from "./scenes.loader";
import type { StateKey } from "@angular/core";
import type { Observable } from "rxjs";

import { Injectable, makeStateKey, TransferState } from "@angular/core";
import { ScenesFetcher } from "./scenes-fetcher.service";
import { of } from "rxjs";

@Injectable({ providedIn: "root" })
export class ScenesService {
  private static readonly SCENES_KEY = makeStateKey<SerializedScenes>("scenes");

  public constructor(
    private readonly transferState: TransferState,
    public readonly fetcher: ScenesFetcher
  ) {}

  public execute(id: string): Observable<SerializedScene>;
  public execute(id?: undefined): Observable<SerializedScenes>;
  public execute(id?: string) {
    //@ts-expect-error
    const stored = this.getFromState(id);
    if (stored) {
      return stored;
    }

    const observable = this.fetch(id);
    return observable;
  }

  private fetch(id?: string) {
    //@ts-expect-error
    const key = this.makeStateKey(id);
    //@ts-expect-error
    const observable = this.fetcher.execute(id);
    observable.subscribe((data) => {
      return this.transferState.set(key, data);
    });
    
    return observable;
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
      return makeStateKey<SerializedScene>(`${id}`);
    }

    return ScenesService.SCENES_KEY;
  }
}
