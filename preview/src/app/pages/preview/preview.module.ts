import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { Preview } from "./preview.component";

const routes: Routes = [
  {
    path: "preview",
    component: Preview,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class PreviewModule {}
