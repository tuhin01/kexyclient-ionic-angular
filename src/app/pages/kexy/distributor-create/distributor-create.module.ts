import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistributorCreatePageRoutingModule } from './distributor-create-routing.module';

import { DistributorCreatePage } from './distributor-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistributorCreatePageRoutingModule
  ],
  declarations: [DistributorCreatePage]
})
export class DistributorCreatePageModule {}
