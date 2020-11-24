import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistributorRepOrderDetailsPage } from './distributor-rep-order-details.page';

const routes: Routes = [
  {
    path: '',
    component: DistributorRepOrderDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributorRepOrderDetailsPageRoutingModule {}
