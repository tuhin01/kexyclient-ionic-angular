import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierInviteEmployeePage } from './supplier-invite-employee.page';

const routes: Routes = [
  {
    path: '',
    component: SupplierInviteEmployeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierInviteEmployeePageRoutingModule {}
