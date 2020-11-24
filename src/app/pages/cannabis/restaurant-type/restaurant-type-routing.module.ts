import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantTypePage } from './restaurant-type.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantTypePageRoutingModule {}
