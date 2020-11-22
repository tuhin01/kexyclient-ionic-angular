import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepDeliveryMethodPageRoutingModule } from './rep-delivery-method-routing.module';

import { RepDeliveryMethodPage } from './rep-delivery-method.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepDeliveryMethodPageRoutingModule
  ],
  declarations: [RepDeliveryMethodPage]
})
export class RepDeliveryMethodPageModule {}
