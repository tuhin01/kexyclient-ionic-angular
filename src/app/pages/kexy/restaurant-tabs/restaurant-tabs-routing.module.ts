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
        path: routeConstants.KEXY.ALL_CONTACTS,
        loadChildren: () => import('../../../pages/kexy/all-contacts/all-contacts.module').then( m => m.AllContactsPageModule)
      },
      {
        path: routeConstants.KEXY.MESSAGE_CONV,
        loadChildren: () => import('../../../pages/kexy/message-conversation/message-conversation.module').then( m => m.MessageConversationPageModule)
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
