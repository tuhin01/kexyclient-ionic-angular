import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteDistributorEmployeePageRoutingModule } from './invite-distributor-employee-routing.module';

import { InviteDistributorEmployeePage } from './invite-distributor-employee.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        InviteDistributorEmployeePageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [InviteDistributorEmployeePage]
})
export class InviteDistributorEmployeePageModule {}
