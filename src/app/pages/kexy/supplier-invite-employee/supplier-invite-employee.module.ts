import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplierInviteEmployeePageRoutingModule } from './supplier-invite-employee-routing.module';

import { SupplierInviteEmployeePage } from './supplier-invite-employee.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SupplierInviteEmployeePageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [SupplierInviteEmployeePage]
})
export class SupplierInviteEmployeePageModule {}
