import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistributorSelectTypePage } from './distributor-select-type.page';

const routes: Routes = [
  {
    path: '',
    component: DistributorSelectTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributorSelectTypePageRoutingModule {}
