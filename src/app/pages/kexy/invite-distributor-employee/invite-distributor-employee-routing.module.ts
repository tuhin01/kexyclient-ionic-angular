import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteDistributorEmployeePage } from './invite-distributor-employee.page';

const routes: Routes = [
  {
    path: '',
    component: InviteDistributorEmployeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteDistributorEmployeePageRoutingModule {}
