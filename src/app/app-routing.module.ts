import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () => import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "app-select",
    loadChildren: () =>
      import("./pages/app-select/app-select.module").then((m) => m.AppSelectPageModule),
  },
  {
    path: "",
    redirectTo: "app-select",
    pathMatch: "full",
  },
  {
    path: "kexy-login",
    loadChildren: () => import("./pages/kexy/login/login.module").then((m) => m.LoginPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
