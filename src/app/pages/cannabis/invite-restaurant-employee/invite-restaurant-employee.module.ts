import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteRestaurantEmployeePageRoutingModule } from './invite-restaurant-employee-routing.module';

import { InviteRestaurantEmployeePage } from './invite-restaurant-employee.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        InviteRestaurantEmployeePageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [InviteRestaurantEmployeePage]
})
export class InviteRestaurantEmployeePageModule {}
