import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantTabsPage } from './restaurant-tabs.page';
import {routeConstants} from '../../../../common/routeConstants';

const routes: Routes = [
  {
    path: "",
    component: RestaurantTabsPage,
    children: [
      {
        path: routeConstants.KEXY.RESTAURANT_DASHBOARD,
        children: [
          {
            path: "",
            loadChildren: () => import('../../../pages/kexy/restaurant-dashboard/restaurant-dashboard.module').then( m => m.RestaurantDashboardPageModule)
          }
        ],
      },
      {
        path: routeConstants.KEXY.PLACE_ORDER,
        children: [
          {
            path: "",
            loadChildren: () => import('../../../pages/kexy/place-order/place-order.module').then( m => m.PlaceOrderPageModule)
          }
        ],
      },
      {
        path: routeConstants.KEXY.CONTACTS,
        loadChildren: () => import('../../../pages/kexy/contacts/contacts.module').then( m => m.ContactsPageModule)
      },
      {
        path: "",
        redirectTo: routeConstants.KEXY.RESTAURANT_DASHBOARD,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: "",
    redirectTo: routeConstants.KEXY.RESTAURANT_DASHBOARD,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantTabsPageRoutingModule {}
