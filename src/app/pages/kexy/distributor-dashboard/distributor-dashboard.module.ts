import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistributorDashboardPageRoutingModule } from './distributor-dashboard-routing.module';

import { DistributorDashboardPage } from './distributor-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistributorDashboardPageRoutingModule
  ],
  declarations: [DistributorDashboardPage]
})
export class DistributorDashboardPageModule {}
