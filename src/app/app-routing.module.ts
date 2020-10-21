import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import {routeConstants} from '../common/routeConstants';

const routes: Routes = [
  {
    path: routeConstants.HOME,
    loadChildren: () => import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: routeConstants.APP_SELECT,
    loadChildren: () =>
      import("./pages/app-select/app-select.module").then((m) => m.AppSelectPageModule),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: routeConstants.KEXY.LOGIN,
    loadChildren: () => import("./pages/kexy/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: routeConstants.KEXY.LOGIN_DICISION,
    loadChildren: () => import('./pages/kexy/login-decision/login-decision.module').then( m => m.LoginDecisionPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
