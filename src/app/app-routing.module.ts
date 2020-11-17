import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { routeConstants } from "../common/routeConstants";

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
    redirectTo: routeConstants.HOME,
    pathMatch: "full",
  },
  {
    path: routeConstants.KEXY.LOGIN,
    loadChildren: () => import("./pages/kexy/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: routeConstants.KEXY.LOGIN_DICISION,
    loadChildren: () =>
      import("./pages/kexy/login-decision/login-decision.module").then(
        (m) => m.LoginDecisionPageModule
      ),
  },
  {
    path: routeConstants.KEXY.FORGET_PASSWORD,
    loadChildren: () =>
      import("./pages/kexy/forget-password/forget-password.module").then(
        (m) => m.ForgetPasswordPageModule
      ),
  },
  {
    path: routeConstants.KEXY.PASSWORD_RESET,
    loadChildren: () =>
      import("./pages/kexy/password-reset/password-reset.module").then(
        (m) => m.PasswordResetPageModule
      ),
  },
  {
    path: routeConstants.KEXY.EMAIL_CONFIRMATION,
    loadChildren: () =>
      import("./pages/kexy/email-confirmation/email-confirmation.module").then(
        (m) => m.EmailConfirmationPageModule
      ),
  },
  {
    path: routeConstants.KEXY.EMAIL_VERIFICATION,
    loadChildren: () =>
      import("./pages/kexy/email-verification/email-verification.module").then(
        (m) => m.EmailVerificationPageModule
      ),
  },
  {
    path: routeConstants.KEXY.ADD_NEW_PRODUCT,
    loadChildren: () =>
      import("./pages/kexy/add-new-product/add-new-product.module").then(
        (m) => m.AddNewProductPageModule
      ),
  },
  {
    path: routeConstants.KEXY.REGISTER,
    loadChildren: () => import('./pages/kexy/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: routeConstants.KEXY.JOIN_MARKETPLACED,
    loadChildren: () => import('./pages/kexy/join-marketplace/join-marketplace.module').then( m => m.JoinMarketplacePageModule)
  },
  {
    path: routeConstants.KEXY.TERMS_AND_CONDITION,
    loadChildren: () => import('./pages/kexy/terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsPageModule)
  },
  {
    path: routeConstants.KEXY.WELCOME,
    loadChildren: () => import('./pages/kexy/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: routeConstants.KEXY.MARKETPLACE_TYPE,
    loadChildren: () => import('./pages/kexy/market-place-type/market-place-type.module').then( m => m.MarketPlaceTypePageModule)
  },
  {
    path: routeConstants.KEXY.DISTRIBUTOR_SELECT_TYPE,
    loadChildren: () => import('./pages/kexy/distributor-select-type/distributor-select-type.module').then( m => m.DistributorSelectTypePageModule)
  },
  {
    path: routeConstants.KEXY.RESTAURANT_TYPE,
    loadChildren: () => import('./pages/kexy/restaurant-type/restaurant-type.module').then( m => m.RestaurantTypePageModule)
  },
  {
    path: routeConstants.KEXY.SUPPLIER_SELECT_TYPE,
    loadChildren: () => import('./pages/kexy/supplier-select-type/supplier-select-type.module').then( m => m.SupplierSelectTypePageModule)
  },
  {
    path: routeConstants.KEXY.RESTAURANT_CREATE,
    loadChildren: () => import('./pages/kexy/restaurant-create/restaurant-create.module').then( m => m.RestaurantCreatePageModule)
  },
  {
    path: routeConstants.KEXY.INVITE_RESTAURANT_EMPLOYEE,
    loadChildren: () => import('./pages/kexy/invite-restaurant-employee/invite-restaurant-employee.module').then( m => m.InviteRestaurantEmployeePageModule)
  },
  {
    path: routeConstants.KEXY.DISTRIBUTOR_CREATE,
    loadChildren: () => import('./pages/kexy/distributor-create/distributor-create.module').then( m => m.DistributorCreatePageModule)
  },
  {
    path: routeConstants.KEXY.DISTRIBUTOR_SETUP_RESTAURANT_BAR,
    loadChildren: () => import('./pages/kexy/distributor-setup-restaurant-bar/distributor-setup-restaurant-bar.module').then( m => m.DistributorSetupRestaurantBarPageModule)
  },
  {
    path: routeConstants.KEXY.INVITE_DISTRIBUTOR_EMPLOYEE,
    loadChildren: () => import('./pages/kexy/invite-distributor-employee/invite-distributor-employee.module').then( m => m.InviteDistributorEmployeePageModule)
  },
  {
    path: routeConstants.KEXY.SUPPLIER_CREATE,
    loadChildren: () => import('./pages/kexy/supplier-create/supplier-create.module').then( m => m.SupplierCreatePageModule)
  },
  {
    path: routeConstants.KEXY.SUPPLIER_INVITE_EMPLOYEE,
    loadChildren: () => import('./pages/kexy/supplier-invite-employee/supplier-invite-employee.module').then( m => m.SupplierInviteEmployeePageModule)
  },
  {
    path: routeConstants.KEXY.TUTORIAL,
    loadChildren: () => import('./pages/kexy/tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },





  {
    path: routeConstants.KEXY.RESTAURANT_DASHBOARD,
    loadChildren: () => import('./pages/kexy/restaurant-dashboard/restaurant-dashboard.module').then( m => m.RestaurantDashboardPageModule)
  },







];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
