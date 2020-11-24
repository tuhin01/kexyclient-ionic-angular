import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplierDashboardPageRoutingModule } from './supplier-dashboard-routing.module';

import { SupplierDashboardPage } from './supplier-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupplierDashboardPageRoutingModule
  ],
  declarations: [SupplierDashboardPage]
})
export class SupplierDashboardPageModule {}
