import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplierSelectTypePageRoutingModule } from './supplier-select-type-routing.module';

import { SupplierSelectTypePage } from './supplier-select-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupplierSelectTypePageRoutingModule
  ],
  declarations: [SupplierSelectTypePage]
})
export class SupplierSelectTypePageModule {}
