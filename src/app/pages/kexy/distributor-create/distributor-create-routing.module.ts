import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistributorCreatePage } from './distributor-create.page';

const routes: Routes = [
  {
    path: '',
    component: DistributorCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributorCreatePageRoutingModule {}
