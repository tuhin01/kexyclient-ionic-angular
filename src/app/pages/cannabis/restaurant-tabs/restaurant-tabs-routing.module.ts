import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RestaurantTabsPage } from "./restaurant-tabs.page";
import { routeConstants } from "../../../../common/routeConstants";

const routes: Routes = [
  {
    path: "",
    component: RestaurantTabsPage,
    children: [
      {
        path: routeConstants.CANNABIS.RESTAURANT_DASHBOARD,
        loadChildren: () =>
          import("../../../pages/cannabis/restaurant-dashboard/restaurant-dashboard.module").then(
            (m) => m.RestaurantDashboardPageModule
          ),
      },
      {
        path: routeConstants.CANNABIS.PLACE_ORDER,
        loadChildren: () =>
          import("../../../pages/cannabis/place-order/place-order.module").then(
            (m) => m.PlaceOrderPageModule
          ),
      },
      {
        path: routeConstants.CANNABIS.ALL_CONTACTS,
        loadChildren: () =>
          import("../../../pages/cannabis/all-contacts/all-contacts.module").then(
            (m) => m.AllContactsPageModule
          ),
      },
      {
        path: routeConstants.CANNABIS.MESSAGE,
        loadChildren: () =>
          import("../../../pages/cannabis/message/message.module").then((m) => m.MessagePageModule),
      },
      {
        path: routeConstants.CANNABIS.REVIEW_ORDER,
        loadChildren: () =>
          import("../../../pages/cannabis/review-order/review-order.module").then(
            (m) => m.ReviewOrderPageModule
          ),
      },
      {
        path: routeConstants.CANNABIS.FINALIZE_ORDER,
        loadChildren: () => import('../../../pages/cannabis/finalize-order/finalize-order.module').then( m => m.FinalizeOrderPageModule)
      },
      {
        path: "",
        redirectTo: routeConstants.CANNABIS.RESTAURANT_DASHBOARD,
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: routeConstants.CANNABIS.RESTAURANT_DASHBOARD,
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantTabsPageRoutingModule {}
