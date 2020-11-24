import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantCreatePage } from './restaurant-create.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantCreatePageRoutingModule {}
