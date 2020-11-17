import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistributorSetupRestaurantBarPage } from './distributor-setup-restaurant-bar.page';

const routes: Routes = [
  {
    path: '',
    component: DistributorSetupRestaurantBarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributorSetupRestaurantBarPageRoutingModule {}
