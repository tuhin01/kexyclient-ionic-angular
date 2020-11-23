import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistributorRepOrdersPage } from './distributor-rep-orders.page';

const routes: Routes = [
  {
    path: '',
    component: DistributorRepOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributorRepOrdersPageRoutingModule {}
