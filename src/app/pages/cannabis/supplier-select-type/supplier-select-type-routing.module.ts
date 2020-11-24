import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierSelectTypePage } from './supplier-select-type.page';

const routes: Routes = [
  {
    path: '',
    component: SupplierSelectTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierSelectTypePageRoutingModule {}
