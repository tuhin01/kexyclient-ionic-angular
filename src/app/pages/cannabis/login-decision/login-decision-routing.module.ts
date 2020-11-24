import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginDecisionPage } from './login-decision.page';

const routes: Routes = [
  {
    path: '',
    component: LoginDecisionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginDecisionPageRoutingModule {}
