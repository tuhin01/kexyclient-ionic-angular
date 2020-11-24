import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteRestaurantEmployeePage } from './invite-restaurant-employee.page';

const routes: Routes = [
  {
    path: '',
    component: InviteRestaurantEmployeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteRestaurantEmployeePageRoutingModule {}
