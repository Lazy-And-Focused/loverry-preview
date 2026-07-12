import type { Registries } from "@/utils/registries.loader";

import { Injectable, TransferState } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class RegistriesService extends BaseService {
  public constructor(
    transferState: TransferState,
    http: HttpClient,
  ) {
    super(transferState, http);
  }

  public execute<Registry extends keyof Registries>(registry: Registry): Observable<Registries[Registry]> {
    return this.get<Registries[Registry]>(`/api/registries/${registry}`);
  }
}