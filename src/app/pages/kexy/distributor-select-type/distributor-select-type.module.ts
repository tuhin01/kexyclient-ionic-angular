import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistributorSelectTypePageRoutingModule } from './distributor-select-type-routing.module';

import { DistributorSelectTypePage } from './distributor-select-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistributorSelectTypePageRoutingModule
  ],
  declarations: [DistributorSelectTypePage]
})
export class DistributorSelectTypePageModule {}
