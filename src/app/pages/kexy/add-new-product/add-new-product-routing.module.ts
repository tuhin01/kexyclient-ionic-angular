import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewProductPage } from './add-new-product.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewProductPageRoutingModule {}
