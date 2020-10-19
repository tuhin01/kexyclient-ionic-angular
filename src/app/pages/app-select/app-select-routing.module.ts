import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppSelectPage } from './app-select.page';

const routes: Routes = [
  {
    path: '',
    component: AppSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppSelectPageRoutingModule {}
