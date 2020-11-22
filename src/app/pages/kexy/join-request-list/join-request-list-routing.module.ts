import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinRequestListPage } from './join-request-list.page';

const routes: Routes = [
  {
    path: '',
    component: JoinRequestListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinRequestListPageRoutingModule {}
