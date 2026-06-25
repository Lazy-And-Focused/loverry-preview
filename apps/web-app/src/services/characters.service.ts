import { HttpClient } from "@angular/common/http";
import { Injectable, makeStateKey, TransferState } from "@angular/core";
import { CharacterRegistry } from "@loverry/ast";

import { map, from, of } from "rxjs";

const CHARACTERS_KEY = makeStateKey<CharacterRegistry[]>("main_characters");

export const MAIN_CHARACTERS = ["Ланлир", "Радя", "Фенир", "Аманир"];

@Injectable({ providedIn: "root" })
export class CharactersService {
  public constructor(
    private readonly transferState: TransferState,
    private readonly http: HttpClient,
  ) {}

  public execute() {
    const stored = this.getFromState();
    if (stored) {
      return stored;
    }

    const registryPromise = this.fetch();
    return from(registryPromise).pipe(
      map((registry) => {
        return Object.keys(registry)
          .filter((name) => MAIN_CHARACTERS.includes(name))
          .map((name) => registry[name]);
      }),
    );
  }

  private fetch() {
    const characters =
      this.http.get<Record<string, CharacterRegistry>>("/api/characters");
    return characters;
  }

  private getFromState() {
    const stored = this.transferState.get(CHARACTERS_KEY, null);
    if (stored) {
      this.transferState.remove(CHARACTERS_KEY);
      return of(stored);
    }

    return null;
  }
}
