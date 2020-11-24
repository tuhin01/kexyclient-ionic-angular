import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinRequestPageRoutingModule } from './join-request-routing.module';

import { JoinRequestPage } from './join-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinRequestPageRoutingModule
  ],
  declarations: [JoinRequestPage]
})
export class JoinRequestPageModule {}
