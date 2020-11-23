import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistributorRepOrderDetailsPageRoutingModule } from './distributor-rep-order-details-routing.module';

import { DistributorRepOrderDetailsPage } from './distributor-rep-order-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistributorRepOrderDetailsPageRoutingModule
  ],
  declarations: [DistributorRepOrderDetailsPage]
})
export class DistributorRepOrderDetailsPageModule {}
