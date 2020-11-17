import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistributorSetupRestaurantBarPageRoutingModule } from './distributor-setup-restaurant-bar-routing.module';

import { DistributorSetupRestaurantBarPage } from './distributor-setup-restaurant-bar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistributorSetupRestaurantBarPageRoutingModule
  ],
  declarations: [DistributorSetupRestaurantBarPage]
})
export class DistributorSetupRestaurantBarPageModule {}
