import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierDashboardPage } from './supplier-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: SupplierDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierDashboardPageRoutingModule {}
