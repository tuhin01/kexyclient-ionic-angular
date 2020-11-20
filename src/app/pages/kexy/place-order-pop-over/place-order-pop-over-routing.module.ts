import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaceOrderPopOverPage } from './place-order-pop-over.page';

const routes: Routes = [
  {
    path: '',
    component: PlaceOrderPopOverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceOrderPopOverPageRoutingModule {}
