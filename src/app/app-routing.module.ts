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
    path: routeConstants.KEXY.RESTAURANT_TABS,
    loadChildren: () => import('./pages/kexy/restaurant-tabs/restaurant-tabs.module').then( m => m.RestaurantTabsPageModule)
  },
  {
    path: routeConstants.KEXY.EDIT_PROFILE,
    loadChildren: () => import('./pages/kexy/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: routeConstants.KEXY.EDIT_RESTAURANT,
    loadChildren: () => import('./pages/kexy/edit-restaurant/edit-restaurant.module').then( m => m.EditRestaurantPageModule)
  },
  {
    path: routeConstants.KEXY.INVITE_PEOPLE,
    loadChildren: () => import('./pages/kexy/invite-people/invite-people.module').then( m => m.InvitePeoplePageModule)
  },
  {
    path: routeConstants.KEXY.SETTINGS,
    loadChildren: () => import('./pages/kexy/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: routeConstants.KEXY.REP_DELIVERY_METHOD,
    loadChildren: () => import('./pages/kexy/rep-delivery-method/rep-delivery-method.module').then( m => m.RepDeliveryMethodPageModule)
  },
  {
    path: routeConstants.KEXY.JOIN_REQUEST_LIST,
    loadChildren: () => import('./pages/kexy/join-request-list/join-request-list.module').then( m => m.JoinRequestListPageModule)
  },
  {
    path: routeConstants.KEXY.EDIT_DISTRIBUTOR,
    loadChildren: () => import('./pages/kexy/edit-distributor/edit-distributor.module').then( m => m.EditDistributorPageModule)
  },
  {
    path: routeConstants.KEXY.DISTRIBUTOR_DASHBOARD,
    loadChildren: () => import('./pages/kexy/distributor-dashboard/distributor-dashboard.module').then( m => m.DistributorDashboardPageModule)
  },
  {
    path: routeConstants.KEXY.MY_RESTAURANTS,
    loadChildren: () => import('./pages/kexy/my-restaurants/my-restaurants.module').then( m => m.MyRestaurantsPageModule)
  },
  {
    path: routeConstants.KEXY.MESSAGE,
    loadChildren: () =>
      import("./pages/kexy/message/message.module").then((m) => m.MessagePageModule),
  },
  {
    path: routeConstants.KEXY.ALL_CONTACTS,
    loadChildren: () =>
      import("./pages/kexy/all-contacts/all-contacts.module").then(
        (m) => m.AllContactsPageModule
      ),
  },
  {
    path: routeConstants.KEXY.MESSAGE_CONV,
    loadChildren: () => import('./pages/kexy/message-conversation/message-conversation.module').then( m => m.MessageConversationPageModule)
  },
  {
    path: routeConstants.KEXY.LOGOUT,
    loadChildren: () => import('./pages/kexy/logout/logout.module').then( m => m.LogoutPageModule)
  },
 
  {
    path: routeConstants.KEXY.EDIT_SUPPLIER,
    loadChildren: () => import('./pages/kexy/edit-supplier/edit-supplier.module').then( m => m.EditSupplierPageModule)
  },
  {
    path: routeConstants.KEXY.SUPPLIER_DASHBOARD,
    loadChildren: () => import('./pages/kexy/supplier-dashboard/supplier-dashboard.module').then( m => m.SupplierDashboardPageModule)
  },
  {
    path: routeConstants.KEXY.DISTRIBUTOR_REP_ORDERS,
    loadChildren: () => import('./pages/kexy/distributor-rep-orders/distributor-rep-orders.module').then( m => m.DistributorRepOrdersPageModule)
  },
  {
    path: routeConstants.KEXY.DISTRIBUTOR_REP_ORDER_DETAILS,
    loadChildren: () => import('./pages/kexy/distributor-rep-order-details/distributor-rep-order-details.module').then( m => m.DistributorRepOrderDetailsPageModule)
  },
  {
    path: routeConstants.KEXY.AUTO_CREATED_USER_UPDATE,
    loadChildren: () => import('./pages/kexy/auto-created-user-update/auto-created-user-update.module').then( m => m.AutoCreatedUserUpdatePageModule)
  },
  {
    path: routeConstants.KEXY.JOIN_REQUEST,
    loadChildren: () => import('./pages/kexy/join-request/join-request.module').then( m => m.JoinRequestPageModule)
  },
  {
    path: routeConstants.CANNABIS.LOGIN,
    loadChildren: () => import('./pages/cannabis/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: routeConstants.CANNABIS.LOGIN_DICISION,
    loadChildren: () =>
      import("./pages/cannabis/login-decision/login-decision.module").then(
        (m) => m.LoginDecisionPageModule
      ),
  },
  {
    path: routeConstants.CANNABIS.FORGET_PASSWORD,
    loadChildren: () =>
      import("./pages/cannabis/forget-password/forget-password.module").then(
        (m) => m.ForgetPasswordPageModule
      ),
  },
  {
    path: routeConstants.CANNABIS.PASSWORD_RESET,
    loadChildren: () =>
      import("./pages/cannabis/password-reset/password-reset.module").then(
        (m) => m.PasswordResetPageModule
      ),
  },
  {
    path: routeConstants.CANNABIS.EMAIL_CONFIRMATION,
    loadChildren: () =>
      import("./pages/cannabis/email-confirmation/email-confirmation.module").then(
        (m) => m.EmailConfirmationPageModule
      ),
  },
  {
    path: routeConstants.CANNABIS.EMAIL_VERIFICATION,
    loadChildren: () =>
      import("./pages/cannabis/email-verification/email-verification.module").then(
        (m) => m.EmailVerificationPageModule
      ),
  },
  {
    path: routeConstants.CANNABIS.ADD_NEW_PRODUCT,
    loadChildren: () =>
      import("./pages/cannabis/add-new-product/add-new-product.module").then(
        (m) => m.AddNewProductPageModule
      ),
  },
  {
    path: routeConstants.CANNABIS.REGISTER,
    loadChildren: () => import('./pages/cannabis/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: routeConstants.CANNABIS.JOIN_MARKETPLACED,
    loadChildren: () => import('./pages/cannabis/join-marketplace/join-marketplace.module').then( m => m.JoinMarketplacePageModule)
  },
  {
    path: routeConstants.CANNABIS.TERMS_AND_CONDITION,
    loadChildren: () => import('./pages/cannabis/terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsPageModule)
  },
  {
    path: routeConstants.CANNABIS.WELCOME,
    loadChildren: () => import('./pages/cannabis/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: routeConstants.CANNABIS.MARKETPLACE_TYPE,
    loadChildren: () => import('./pages/cannabis/market-place-type/market-place-type.module').then( m => m.MarketPlaceTypePageModule)
  },
  {
    path: routeConstants.CANNABIS.DISTRIBUTOR_SELECT_TYPE,
    loadChildren: () => import('./pages/cannabis/distributor-select-type/distributor-select-type.module').then( m => m.DistributorSelectTypePageModule)
  },
  {
    path: routeConstants.CANNABIS.RESTAURANT_TYPE,
    loadChildren: () => import('./pages/cannabis/restaurant-type/restaurant-type.module').then( m => m.RestaurantTypePageModule)
  },
  {
    path: routeConstants.CANNABIS.SUPPLIER_SELECT_TYPE,
    loadChildren: () => import('./pages/cannabis/supplier-select-type/supplier-select-type.module').then( m => m.SupplierSelectTypePageModule)
  },
  {
    path: routeConstants.CANNABIS.RESTAURANT_CREATE,
    loadChildren: () => import('./pages/cannabis/restaurant-create/restaurant-create.module').then( m => m.RestaurantCreatePageModule)
  },
  {
    path: routeConstants.CANNABIS.INVITE_RESTAURANT_EMPLOYEE,
    loadChildren: () => import('./pages/cannabis/invite-restaurant-employee/invite-restaurant-employee.module').then( m => m.InviteRestaurantEmployeePageModule)
  },
  {
    path: routeConstants.CANNABIS.DISTRIBUTOR_CREATE,
    loadChildren: () => import('./pages/cannabis/distributor-create/distributor-create.module').then( m => m.DistributorCreatePageModule)
  },
  {
    path: routeConstants.CANNABIS.DISTRIBUTOR_SETUP_RESTAURANT_BAR,
    loadChildren: () => import('./pages/cannabis/distributor-setup-restaurant-bar/distributor-setup-restaurant-bar.module').then( m => m.DistributorSetupRestaurantBarPageModule)
  },
  {
    path: routeConstants.CANNABIS.INVITE_DISTRIBUTOR_EMPLOYEE,
    loadChildren: () => import('./pages/cannabis/invite-distributor-employee/invite-distributor-employee.module').then( m => m.InviteDistributorEmployeePageModule)
  },
  {
    path: routeConstants.CANNABIS.SUPPLIER_CREATE,
    loadChildren: () => import('./pages/cannabis/supplier-create/supplier-create.module').then( m => m.SupplierCreatePageModule)
  },
  {
    path: routeConstants.CANNABIS.SUPPLIER_INVITE_EMPLOYEE,
    loadChildren: () => import('./pages/cannabis/supplier-invite-employee/supplier-invite-employee.module').then( m => m.SupplierInviteEmployeePageModule)
  },
  {
    path: routeConstants.CANNABIS.TUTORIAL,
    loadChildren: () => import('./pages/cannabis/tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },
  {
    path: routeConstants.CANNABIS.RESTAURANT_TABS,
    loadChildren: () => import('./pages/cannabis/restaurant-tabs/restaurant-tabs.module').then( m => m.RestaurantTabsPageModule)
  },
  {
    path: routeConstants.CANNABIS.EDIT_PROFILE,
    loadChildren: () => import('./pages/cannabis/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: routeConstants.CANNABIS.EDIT_RESTAURANT,
    loadChildren: () => import('./pages/cannabis/edit-restaurant/edit-restaurant.module').then( m => m.EditRestaurantPageModule)
  },
  {
    path: routeConstants.CANNABIS.INVITE_PEOPLE,
    loadChildren: () => import('./pages/cannabis/invite-people/invite-people.module').then( m => m.InvitePeoplePageModule)
  },
  {
    path: routeConstants.CANNABIS.SETTINGS,
    loadChildren: () => import('./pages/cannabis/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: routeConstants.CANNABIS.REP_DELIVERY_METHOD,
    loadChildren: () => import('./pages/cannabis/rep-delivery-method/rep-delivery-method.module').then( m => m.RepDeliveryMethodPageModule)
  },
  {
    path: routeConstants.CANNABIS.JOIN_REQUEST_LIST,
    loadChildren: () => import('./pages/cannabis/join-request-list/join-request-list.module').then( m => m.JoinRequestListPageModule)
  },
  {
    path: routeConstants.CANNABIS.EDIT_DISTRIBUTOR,
    loadChildren: () => import('./pages/cannabis/edit-distributor/edit-distributor.module').then( m => m.EditDistributorPageModule)
  },
  {
    path: routeConstants.CANNABIS.DISTRIBUTOR_DASHBOARD,
    loadChildren: () => import('./pages/cannabis/distributor-dashboard/distributor-dashboard.module').then( m => m.DistributorDashboardPageModule)
  },
  {
    path: routeConstants.CANNABIS.MY_RESTAURANTS,
    loadChildren: () => import('./pages/cannabis/my-restaurants/my-restaurants.module').then( m => m.MyRestaurantsPageModule)
  },
  {
    path: routeConstants.CANNABIS.MESSAGE,
    loadChildren: () =>
      import("./pages/cannabis/message/message.module").then((m) => m.MessagePageModule),
  },
  {
    path: routeConstants.CANNABIS.ALL_CONTACTS,
    loadChildren: () =>
      import("./pages/cannabis/all-contacts/all-contacts.module").then(
        (m) => m.AllContactsPageModule
      ),
  },
  {
    path: routeConstants.CANNABIS.MESSAGE_CONV,
    loadChildren: () => import('./pages/cannabis/message-conversation/message-conversation.module').then( m => m.MessageConversationPageModule)
  },
  {
    path: routeConstants.CANNABIS.LOGOUT,
    loadChildren: () => import('./pages/cannabis/logout/logout.module').then( m => m.LogoutPageModule)
  },

  {
    path: routeConstants.CANNABIS.EDIT_SUPPLIER,
    loadChildren: () => import('./pages/cannabis/edit-supplier/edit-supplier.module').then( m => m.EditSupplierPageModule)
  },
  {
    path: routeConstants.CANNABIS.SUPPLIER_DASHBOARD,
    loadChildren: () => import('./pages/cannabis/supplier-dashboard/supplier-dashboard.module').then( m => m.SupplierDashboardPageModule)
  },
  {
    path: routeConstants.CANNABIS.DISTRIBUTOR_REP_ORDERS,
    loadChildren: () => import('./pages/cannabis/distributor-rep-orders/distributor-rep-orders.module').then( m => m.DistributorRepOrdersPageModule)
  },
  {
    path: routeConstants.CANNABIS.DISTRIBUTOR_REP_ORDER_DETAILS,
    loadChildren: () => import('./pages/cannabis/distributor-rep-order-details/distributor-rep-order-details.module').then( m => m.DistributorRepOrderDetailsPageModule)
  },
  {
    path: routeConstants.CANNABIS.AUTO_CREATED_USER_UPDATE,
    loadChildren: () => import('./pages/cannabis/auto-created-user-update/auto-created-user-update.module').then( m => m.AutoCreatedUserUpdatePageModule)
  },
  {
    path: routeConstants.CANNABIS.JOIN_REQUEST,
    loadChildren: () => import('./pages/cannabis/join-request/join-request.module').then( m => m.JoinRequestPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
