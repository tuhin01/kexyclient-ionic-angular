import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistributorRepOrdersPageRoutingModule } from './distributor-rep-orders-routing.module';

import { DistributorRepOrdersPage } from './distributor-rep-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistributorRepOrdersPageRoutingModule
  ],
  declarations: [DistributorRepOrdersPage]
})
export class DistributorRepOrdersPageModule {}
