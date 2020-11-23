import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewOrderPageRoutingModule } from './review-order-routing.module';

import { ReviewOrderPage } from './review-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewOrderPageRoutingModule
  ],
  declarations: [ReviewOrderPage]
})
export class ReviewOrderPageModule {}
