import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyRestaurantsPage } from './my-restaurants.page';

const routes: Routes = [
  {
    path: '',
    component: MyRestaurantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyRestaurantsPageRoutingModule {}
