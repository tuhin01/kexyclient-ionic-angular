import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceOrderPopOverPageRoutingModule } from './place-order-pop-over-routing.module';

import { PlaceOrderPopOverPage } from './place-order-pop-over.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceOrderPopOverPageRoutingModule
  ],
  declarations: [PlaceOrderPopOverPage]
})
export class PlaceOrderPopOverPageModule {}
