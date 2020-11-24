import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinMarketplacePage } from './join-marketplace.page';

const routes: Routes = [
  {
    path: '',
    component: JoinMarketplacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinMarketplacePageRoutingModule {}
