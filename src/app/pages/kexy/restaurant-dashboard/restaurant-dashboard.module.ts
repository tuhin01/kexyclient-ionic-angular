import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantDashboardPageRoutingModule } from './restaurant-dashboard-routing.module';

import { RestaurantDashboardPage } from './restaurant-dashboard.page';
import {ComponentsModule} from '../../../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RestaurantDashboardPageRoutingModule,
        ComponentsModule
    ],
  declarations: [RestaurantDashboardPage]
})
export class RestaurantDashboardPageModule {}
