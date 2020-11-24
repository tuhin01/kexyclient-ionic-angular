import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplierCreatePageRoutingModule } from './supplier-create-routing.module';

import { SupplierCreatePage } from './supplier-create.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SupplierCreatePageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [SupplierCreatePage]
})
export class SupplierCreatePageModule {}
