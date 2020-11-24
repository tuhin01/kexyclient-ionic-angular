import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinRequestListPageRoutingModule } from './join-request-list-routing.module';

import { JoinRequestListPage } from './join-request-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinRequestListPageRoutingModule
  ],
  declarations: [JoinRequestListPage]
})
export class JoinRequestListPageModule {}
