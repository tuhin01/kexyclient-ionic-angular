import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantTabsPage } from './restaurant-tabs.page';
import {routeConstants} from '../../../../common/routeConstants';

const routes: Routes = [
  {
    path: routeConstants.KEXY.RESTAURANT_TABS,
    component: RestaurantTabsPage,
    children: [
      {
        path: routeConstants.KEXY.RESTAURANT_DASHBOARD,
        loadChildren: () => import('../../../pages/kexy/restaurant-dashboard/restaurant-dashboard.module').then( m => m.RestaurantDashboardPageModule)
      },
      {
        path: "",
        redirectTo: routeConstants.KEXY.RESTAURANT_TABS + "/" +routeConstants.KEXY.RESTAURANT_DASHBOARD,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: "",
    redirectTo: routeConstants.KEXY.RESTAURANT_TABS + "/" +routeConstants.KEXY.RESTAURANT_DASHBOARD,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantTabsPageRoutingModule {}
