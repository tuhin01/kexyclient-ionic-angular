import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutoCreatedUserUpdatePage } from './auto-created-user-update.page';

const routes: Routes = [
  {
    path: '',
    component: AutoCreatedUserUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoCreatedUserUpdatePageRoutingModule {}
