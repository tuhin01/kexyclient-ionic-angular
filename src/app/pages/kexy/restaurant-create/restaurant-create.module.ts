import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantCreatePageRoutingModule } from './restaurant-create-routing.module';

import { RestaurantCreatePage } from './restaurant-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantCreatePageRoutingModule
  ],
  declarations: [RestaurantCreatePage]
})
export class RestaurantCreatePageModule {}
