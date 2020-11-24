import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantTabsPageRoutingModule } from './restaurant-tabs-routing.module';

import { RestaurantTabsPage } from './restaurant-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantTabsPageRoutingModule
  ],
  declarations: [RestaurantTabsPage]
})
export class RestaurantTabsPageModule {}
