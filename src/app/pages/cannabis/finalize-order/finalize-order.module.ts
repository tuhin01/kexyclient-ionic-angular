import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinalizeOrderPageRoutingModule } from './finalize-order-routing.module';

import { FinalizeOrderPage } from './finalize-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinalizeOrderPageRoutingModule
  ],
  declarations: [FinalizeOrderPage]
})
export class FinalizeOrderPageModule {}
