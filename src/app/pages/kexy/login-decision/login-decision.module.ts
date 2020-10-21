import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginDecisionPageRoutingModule } from './login-decision-routing.module';

import { LoginDecisionPage } from './login-decision.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginDecisionPageRoutingModule
  ],
  declarations: [LoginDecisionPage]
})
export class LoginDecisionPageModule {}
