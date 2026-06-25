import { RouterModule, Routes } from "@angular/router";

import { NgModule } from "@angular/core";
import { useLayout } from "@/utils/use-layout";

import { Layouts } from "./layouts";
import { HomeRoute } from "./home";
import { PagesRoutes } from "./pages";

export const routes: Routes = [
  useLayout({
    layout: Layouts.DefaultLayout,
    routes: [HomeRoute, ...PagesRoutes],
  }),
  useLayout({
    layout: Layouts.NoLayout,
    routes: [],
  }),
  useLayout({
    layout: Layouts.NoLayout,
    routes: [HomeRoute, ...PagesRoutes],
    route: {
      path: "nolayout",
    },
  }),
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppModule {}
