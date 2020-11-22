import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistributorDashboardPage } from './distributor-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DistributorDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributorDashboardPageRoutingModule {}
