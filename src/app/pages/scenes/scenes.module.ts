import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { ScenesComponent } from "./scenes.component";

const routes: Routes = [
  {
    path: "scenes",
    component: ScenesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class ScenesModule {}
