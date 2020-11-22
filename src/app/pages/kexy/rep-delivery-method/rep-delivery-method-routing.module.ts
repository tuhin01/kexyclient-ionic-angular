import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepDeliveryMethodPage } from './rep-delivery-method.page';

const routes: Routes = [
  {
    path: '',
    component: RepDeliveryMethodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepDeliveryMethodPageRoutingModule {}
