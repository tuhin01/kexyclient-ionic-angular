import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantTypePageRoutingModule } from './restaurant-type-routing.module';

import { RestaurantTypePage } from './restaurant-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantTypePageRoutingModule
  ],
  declarations: [RestaurantTypePage]
})
export class RestaurantTypePageModule {}
