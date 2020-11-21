import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRestaurantPageRoutingModule } from './edit-restaurant-routing.module';

import { EditRestaurantPage } from './edit-restaurant.page';
import {ComponentsModule} from '../../../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditRestaurantPageRoutingModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
  declarations: [EditRestaurantPage]
})
export class EditRestaurantPageModule {}
