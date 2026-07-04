import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { provideIcons } from "@ng-icons/core";

import { IconLink } from "@/app/components/icon-link";
import { heroGlobeAlt } from "@ng-icons/heroicons/outline";
import {
  bootstrapTelegram,
  bootstrapGithub,
  bootstrapBluesky,
} from "@ng-icons/bootstrap-icons";

@Component({
  selector: "default-layout",
  templateUrl: "./default.html",
  imports: [RouterOutlet, IconLink],
  viewProviders: [
    provideIcons({
      heroGlobeAlt,
      bootstrapGithub,
      bootstrapTelegram,
      bootstrapBluesky,
    }),
  ],
})
export class DefaultLayout {
  protected readonly currentYear = new Date().getFullYear();
}
