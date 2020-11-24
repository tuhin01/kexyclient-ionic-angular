import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketPlaceTypePage } from './market-place-type.page';

const routes: Routes = [
  {
    path: '',
    component: MarketPlaceTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketPlaceTypePageRoutingModule {}
