import { provideRouter } from "@angular/router";
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";

import { routes } from "./app.module";
import { provideHttpClient, withFetch } from "@angular/common/http";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ],
};
