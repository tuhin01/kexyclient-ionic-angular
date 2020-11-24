import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinRequestPage } from './join-request.page';

const routes: Routes = [
  {
    path: '',
    component: JoinRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinRequestPageRoutingModule {}
