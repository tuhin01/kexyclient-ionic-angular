import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierCreatePage } from './supplier-create.page';

const routes: Routes = [
  {
    path: '',
    component: SupplierCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierCreatePageRoutingModule {}
