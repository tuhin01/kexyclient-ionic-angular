import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewOrderPage } from './review-order.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewOrderPageRoutingModule {}
