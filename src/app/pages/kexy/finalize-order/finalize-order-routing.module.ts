import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinalizeOrderPage } from './finalize-order.page';

const routes: Routes = [
  {
    path: '',
    component: FinalizeOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalizeOrderPageRoutingModule {}
