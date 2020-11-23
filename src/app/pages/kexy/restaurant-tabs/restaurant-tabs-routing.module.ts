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
        path: routeConstants.KEXY.RESTAURANT_DASHBOARD,
        loadChildren: () =>
          import("../../../pages/kexy/restaurant-dashboard/restaurant-dashboard.module").then(
            (m) => m.RestaurantDashboardPageModule
          ),
      },
      {
        path: routeConstants.KEXY.PLACE_ORDER,
        loadChildren: () =>
          import("../../../pages/kexy/place-order/place-order.module").then(
            (m) => m.PlaceOrderPageModule
          ),
      },
      {
        path: routeConstants.KEXY.ALL_CONTACTS,
        loadChildren: () =>
          import("../../../pages/kexy/all-contacts/all-contacts.module").then(
            (m) => m.AllContactsPageModule
          ),
      },
      {
        path: routeConstants.KEXY.MESSAGE,
        loadChildren: () =>
          import("../../../pages/kexy/message/message.module").then((m) => m.MessagePageModule),
      },
      {
        path: routeConstants.KEXY.REVIEW_ORDER,
        loadChildren: () =>
          import("../../../pages/kexy/review-order/review-order.module").then(
            (m) => m.ReviewOrderPageModule
          ),
      },
      {
        path: routeConstants.KEXY.FINALIZE_ORDER,
        loadChildren: () => import('../../../pages/kexy/finalize-order/finalize-order.module').then( m => m.FinalizeOrderPageModule)
      },
      {
        path: "",
        redirectTo: routeConstants.KEXY.RESTAURANT_DASHBOARD,
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: routeConstants.KEXY.RESTAURANT_DASHBOARD,
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantTabsPageRoutingModule {}
