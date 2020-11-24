import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDistributorPage } from './edit-distributor.page';

const routes: Routes = [
  {
    path: '',
    component: EditDistributorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDistributorPageRoutingModule {}
