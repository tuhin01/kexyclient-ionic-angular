import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRestaurantsPageRoutingModule } from './my-restaurants-routing.module';

import { MyRestaurantsPage } from './my-restaurants.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyRestaurantsPageRoutingModule
  ],
  declarations: [MyRestaurantsPage]
})
export class MyRestaurantsPageModule {}
