import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewProductPageRoutingModule } from './add-new-product-routing.module';

import { AddNewProductPage } from './add-new-product.page';
import {ComponentsModule} from '../../../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddNewProductPageRoutingModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
  declarations: [AddNewProductPage]
})
export class AddNewProductPageModule {}
