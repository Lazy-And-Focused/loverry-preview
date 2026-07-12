import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/core';
import { from, map, of } from 'rxjs';

export class BaseService {
  public constructor(
    protected readonly transferState: TransferState,
    protected readonly http: HttpClient,
  ) {}

  protected get<T>(path: string) {
    const key = this.makeStateKey<T>(path);
    const observale = this.getFromState<T>(path);
    if (observale) {
      return observale;
    }

    const json = this.http.get<{ data: T }>(path, { responseType: 'json' });
    json.subscribe(({ data }) => {
      this.transferState.set(key, data);
    });

    const data = from(json).pipe(map(({ data }) => data));
    return data;
  }

  protected getFromState<T>(path: string) {
    const key = this.makeStateKey<T>(path);
    const state = this.transferState.get<T | null>(key, null);
    if (!state) {
      return null;
    }

    this.transferState.remove(key);
    return of(state);
  }

  protected makeStateKey<T>(path: string) {
    return makeStateKey<T>(path);
  }
}
